#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod audio;
mod resource;
mod run;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            audio::get_audio_devices,
            run::run_voice_recognizer,
            run::stop_voice_recognizer,
            resource::list_path_files
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
