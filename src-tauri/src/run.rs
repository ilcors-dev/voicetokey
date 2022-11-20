use chrono::Local;
use enigo::{Enigo, KeyboardControllable};
use porcupine::{Porcupine, PorcupineBuilder};
use pv_recorder::RecorderBuilder;
use std::{
    sync::atomic::{AtomicBool, Ordering},
    thread,
};
use tauri::utils::assets::phf::phf_map;

static KEYS: phf::Map<&'static str, enigo::Key> = phf_map! {
    "a" => enigo::Key::Layout('a'),
    "b" => enigo::Key::Layout('b'),
    "c" => enigo::Key::Layout('c'),
    "d" => enigo::Key::Layout('d'),
    "e" => enigo::Key::Layout('e'),
    "f" => enigo::Key::Layout('f'),
    "g" => enigo::Key::Layout('g'),
    "h" => enigo::Key::Layout('h'),
    "i" => enigo::Key::Layout('i'),
    "j" => enigo::Key::Layout('j'),
    "k" => enigo::Key::Layout('k'),
    "l" => enigo::Key::Layout('l'),
    "m" => enigo::Key::Layout('m'),
    "n" => enigo::Key::Layout('n'),
    "o" => enigo::Key::Layout('o'),
    "p" => enigo::Key::Layout('p'),
    "q" => enigo::Key::Layout('q'),
    "r" => enigo::Key::Layout('r'),
    "s" => enigo::Key::Layout('s'),
    "t" => enigo::Key::Layout('t'),
    "u" => enigo::Key::Layout('u'),
    "v" => enigo::Key::Layout('v'),
    "w" => enigo::Key::Layout('w'),
    "x" => enigo::Key::Layout('x'),
    "y" => enigo::Key::Layout('y'),
    "z" => enigo::Key::Layout('z'),
    "up" => enigo::Key::UpArrow,
    "down" => enigo::Key::DownArrow,
    "left" => enigo::Key::LeftArrow,
    "right" => enigo::Key::RightArrow,
    "space" => enigo::Key::Space,
    "enter" => enigo::Key::Return,
    "tab" => enigo::Key::Tab,
    "backspace" => enigo::Key::Backspace,
    "escape" => enigo::Key::Escape,
    "delete" => enigo::Key::Delete,
    "home" => enigo::Key::Home,
    "end" => enigo::Key::End,
    "pageup" => enigo::Key::PageUp,
    "pagedown" => enigo::Key::PageDown,
    "capslock" => enigo::Key::CapsLock,
    "f1" => enigo::Key::F1,
    "f2" => enigo::Key::F2,
    "f3" => enigo::Key::F3,
    "f4" => enigo::Key::F4,
    "f5" => enigo::Key::F5,
    "f6" => enigo::Key::F6,
    "f7" => enigo::Key::F7,
    "f8" => enigo::Key::F8,
    "f9" => enigo::Key::F9,
    "f10" => enigo::Key::F10,
    "f11" => enigo::Key::F11,
    "f12" => enigo::Key::F12,
    "ctrl" => enigo::Key::Control,
    "alt" => enigo::Key::Alt,
    "shift" => enigo::Key::Shift,
    "option" => enigo::Key::Option,
    "meta" => enigo::Key::Meta,
};

static LISTENING: AtomicBool = AtomicBool::new(false);
static BOOTED: AtomicBool = AtomicBool::new(false);

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

/// Since the paths passed from tauri look something like this:
/// \\\\?\\C:\\Users\\x\\x\\voicetokey\\src-tauri\\target\\debug\\resources\\wake-words-ppn\\fai-la-clip_it_mac_v2_1_0.ppn
/// we need to remove the chars until the start of the disk path.
fn sanitize_path(path: &str) -> String {
    let mut valid_path = String::new();

    let chars = path.chars();

    let mut found_colon = false;

    for (i, c) in chars.enumerate() {
        if c == ':' {
            found_colon = true;

            valid_path.push(path.chars().nth(i - 1).unwrap());
        }

        if found_colon {
            valid_path.push(c);
        }
    }

    return valid_path.replace("\\", "/");
}

#[tauri::command]
pub fn run_voice_recognizer(
    access_key: String,
    input_device_index: i32,
    keyword_paths: Vec<String>,
    model_path: String,
    window: tauri::Window,
    key_combination: Vec<String>,
) {
    let mut enigo = Enigo::new();

    // print arguments
    println!("Access Key: {}", access_key);
    println!("Input Device Index: {}", input_device_index);
    println!("Keyword Paths: {:?}", keyword_paths);
    println!("Model Path: {}", model_path);
    println!("Key Combination: {:?}", key_combination);

    // sanitize paths of keyword_paths
    let sanitized_keyword_paths: Vec<String> = keyword_paths
        .iter()
        .map(|path| sanitize_path(path))
        .collect();

    // print sanitized paths
    println!("Sanitized Keyword Paths: {:?}", sanitized_keyword_paths);

    let porcupine: Porcupine =
        PorcupineBuilder::new_with_keyword_paths(access_key, sanitized_keyword_paths.as_slice())
            .model_path(sanitize_path(model_path.as_str()))
            .init()
            .expect("Unable to create Porcupine");

    let recorder = RecorderBuilder::new()
        .device_index(input_device_index)
        .frame_length(porcupine.frame_length() as i32)
        .init()
        .expect("Failed to initialize pvrecorder");

    recorder.start().expect("Failed to start audio recording");

    LISTENING.store(true, Ordering::SeqCst);

    // fix, we shall not set an handler for ctrcl+c multiple times, the program would crash
    if !BOOTED.load(Ordering::SeqCst) {
        ctrlc::set_handler(|| {
            LISTENING.store(false, Ordering::SeqCst);
        })
        .expect("Unable to setup signal handler");
    }

    println!("Listening for wake words...");

    thread::spawn(move || {
        while LISTENING.load(Ordering::SeqCst) {
            let mut pcm = vec![0; recorder.frame_length()];
            recorder.read(&mut pcm).expect("Failed to read audio frame");

            let keyword_index = porcupine.process(&pcm).unwrap();
            if keyword_index >= 0 {
                println!("[{}] clippo!", Local::now().format("%F %T"));

                window
                    .emit(
                        "wake-word-detected",
                        Payload {
                            message: "Wake word detected, firing key combination.".into(),
                        },
                    )
                    .unwrap();

                for key in key_combination.iter() {
                    let key = key.to_lowercase();

                    enigo.key_down(KEYS.get(key.as_str()).unwrap().clone());
                }

                for key in key_combination.iter() {
                    let key = key.to_lowercase();

                    enigo.key_up(KEYS.get(key.as_str()).unwrap().clone());
                }
            }
        }
    });

    // println!("\nStopping...");
    // recorder.stop().expect("Failed to stop audio recording");
    BOOTED.store(true, Ordering::SeqCst);
}

#[tauri::command]
pub fn stop_voice_recognizer() {
    LISTENING.store(false, Ordering::SeqCst);
}
