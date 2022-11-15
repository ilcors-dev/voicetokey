use chrono::Local;
use enigo::{Enigo, KeyboardControllable};
use porcupine::{Porcupine, PorcupineBuilder};
use pv_recorder::RecorderBuilder;
use std::{
    sync::atomic::{AtomicBool, Ordering},
    thread,
};

static LISTENING: AtomicBool = AtomicBool::new(false);

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
) {
    let mut enigo = Enigo::new();

    // print arguments
    println!("Access Key: {}", access_key);
    println!("Input Device Index: {}", input_device_index);
    println!("Keyword Paths: {:?}", keyword_paths);
    println!("Model Path: {}", model_path);

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
    ctrlc::set_handler(|| {
        LISTENING.store(false, Ordering::SeqCst);
    })
    .expect("Unable to setup signal handler");

    println!("Listening for wake words...");

    thread::spawn(move || {
        while LISTENING.load(Ordering::SeqCst) {
            let mut pcm = vec![0; recorder.frame_length()];
            recorder.read(&mut pcm).expect("Failed to read audio frame");

            let keyword_index = porcupine.process(&pcm).unwrap();
            if keyword_index >= 0 {
                println!("[{}] clippo!", Local::now().format("%F %T"));
                enigo.key_down(enigo::Key::Alt);
                enigo.key_click(enigo::Key::F10);
                enigo.key_up(enigo::Key::Alt);
            }
        }
    });

    println!("\nStopping...");
    // recorder.stop().expect("Failed to stop audio recording");
}

#[tauri::command]
pub fn stop_voice_recognizer() {
    LISTENING.store(false, Ordering::SeqCst);
}
