use std::env;

pub fn get_env(key: &str, default: &str) -> String {
    // Check .env file
    match dotenvy::var(key) {
        Ok(v) => return v,
        Err(_) => {
            // Check linux env
            match env::var(key) {
                Ok(v) => return v,
                Err(_) => {
                    // def
                    println!("{key} not provided, defaulting to {default}");
                    default.to_string()
                }
            }
        }
    }
}
