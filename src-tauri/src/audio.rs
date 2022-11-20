use cpal::traits::{DeviceTrait, HostTrait};

#[tauri::command]
pub fn get_audio_devices() -> Vec<String> {
    let host = cpal::default_host();
    let devices = host.input_devices().unwrap().enumerate();
    let mut device_names = Vec::new();

    for device in devices {
        let device_name = device.1.name().unwrap();
        device_names.push(device_name);
    }

    return device_names;
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
