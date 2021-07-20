#[macro_use] extern crate rocket;

use rocket::fs::{relative, FileServer};

#[launch]
fn rocket() -> _ {
    // Should be able to navigate to http://localhost:8000 for dev build
    // See Rocket.toml file for other configuration options
    // Serves up all files in `pages/` as static content
    rocket::build().mount("/", FileServer::from(relative!("pages")))
}
