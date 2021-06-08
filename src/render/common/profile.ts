
import profileJson from './profile.json';


class Profile {

  profileJson: typeof profileJson;
  port: number;

  constructor() {
    this.profileJson = profileJson;
    this.port = profileJson.port;
  }
}