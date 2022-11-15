use chrono::Local;
use enigo::{Enigo, KeyboardControllable};
use porcupine::{Porcupine, PorcupineBuilder};
use pv_recorder::RecorderBuilder;
use std::sync::atomic::{AtomicBool, Ordering};

static LISTENING: AtomicBool = AtomicBool::new(false);

#[tauri::command]
pub fn run_voice_recognizer(
    access_key: String,
    input_device_index: i32,
    keyword_paths: Vec<String>,
    model_path: String,
) {
    let mut enigo = Enigo::new();

    let porcupine: Porcupine =
        PorcupineBuilder::new_with_keyword_paths(access_key, keyword_paths.as_slice())
            .model_path(model_path)
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

    println!("\nStopping...");
    recorder.stop().expect("Failed to stop audio recording");
}

#[tauri::command]
pub fn stop_voice_recognizer() {
    LISTENING.store(false, Ordering::SeqCst);
}
