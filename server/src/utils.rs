pub fn get_env(key: &str, default: &str) -> String {
    match dotenvy::var(key) {
        Ok(port) => port,
        Err(_) => {
            println!("{key} not provided, defaulting to {default}");
            default.to_string()
        }
    }
}
