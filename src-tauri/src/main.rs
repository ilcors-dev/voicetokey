#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod audio;
mod run;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![audio::get_audio_devices])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
