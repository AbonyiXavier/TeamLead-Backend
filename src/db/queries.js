export default class Queries {
  static get emailExist() {
    return "SELECT  COUNT( * ) AS count FROM users WHERE email = ?";
  }

  static get saveNewUser() {
    return "INSERT INTO users SET ?";
  }

  //   static get createTrip() {
  //     return `INSERT into trips (busid, origin, destination, tripdate, fare, status)
  //      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  //   }

  //   static get getAllTrips() {
  //     return "SELECT * from trips";
  //   }
}
