use std::fs;

#[tauri::command]
pub fn list_path_files(path: String) -> Vec<String> {
    let mut files = Vec::new();
    for entry in fs::read_dir(path).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.is_file() {
            files.push(path.to_str().unwrap().to_string());
        }
    }

    return files;
}
