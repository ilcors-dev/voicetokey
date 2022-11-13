use pv_recorder::RecorderBuilder;

#[tauri::command]
pub fn get_audio_devices() -> Vec<String> {
    let mut devices = Vec::<String>::new();

    let audio_devices = RecorderBuilder::new()
        .init()
        .expect("Failed to initialize pvrecorder")
        .get_audio_devices();

    match audio_devices {
        Ok(audio_devices) => {
            for (idx, device) in audio_devices.iter().enumerate() {
                devices.push(String::from(device));
                // println!("index: {}, device name: {:?}", idx, device);
            }
        }
        Err(err) => panic!("Failed to get audio devices: {}", err),
    };

    return devices;
}

// /**
//  * User's must be able to specify the audio device index to use.
//  */
// fn select_input_source() -> i32 {
//     let sources = show_audio_devices();

//     print!("Select input source by index: ");

//     let mut input = String::new();

//     std::io::stdin()
//         .read_line(&mut input)
//         .expect("Failed to read line");

//     let trimmed = input.trim();

//     match trimmed.parse::<i32>() {
//         Ok(i) => i,
//         Err(..) => panic!("This was not an integer: {}", trimmed),
//     };

//     let input_source = input.trim().parse::<i32>().unwrap();

//     if !sources.contains(&input_source) {
//         panic!(
//             "Invalid input source, allowed sources indexes are: {:?}",
//             sources
//         );
//     }

//     return input_source;
// }
