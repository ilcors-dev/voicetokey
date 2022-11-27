use std::env::current_exe;

use auto_launch::*;
use log::info;
use tauri::App;

pub static mut AUTO_START: Option<AutoLaunch> = None;

pub fn start(app: &mut App) {
    let app_name = &app.package_info().name;
    let current_exe = current_exe().unwrap();

    unsafe {
        AUTO_START = Some(
            AutoLaunchBuilder::new()
                .set_app_name(&app_name)
                .set_app_path(&current_exe.to_str().unwrap())
                .set_use_launch_agent(true)
                .set_args(&["--minimized"])
                .build()
                .unwrap(),
        );
    }
}

#[tauri::command]
pub fn toggle_run_on_startup(open: bool) {
    unsafe {
        if let Some(auto_start) = &mut AUTO_START {
            if open {
                match auto_start.enable() {
                    Ok(_) => info!("Enabled auto start"),
                    Err(e) => info!("Error enabling auto start: {}", e),
                };
            } else {
                match auto_start.disable() {
                    Ok(_) => info!("Disabled auto start"),
                    Err(e) => info!("Error disabled auto start: {}", e),
                };
            };
        }
    }
}
