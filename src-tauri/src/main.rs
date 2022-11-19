#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri_plugin_log::{LogTarget, LoggerBuilder};

mod audio;
mod resource;
mod run;

fn main() {
    tauri::Builder::default()
        .plugin(
            LoggerBuilder::default()
                .targets([
                    LogTarget::LogDir,
                    LogTarget::Stdout,
                    LogTarget::Webview,
                    LogTarget::Stderr,
                ])
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            audio::get_audio_devices,
            run::run_voice_recognizer,
            run::stop_voice_recognizer,
            resource::list_path_files
        ])
        .setup(|app| {
            #[cfg(debug_assertions)]
            app.get_window("main").unwrap().open_devtools();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
