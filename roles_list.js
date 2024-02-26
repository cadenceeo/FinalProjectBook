/**
 * This file creates a list of Roles 
 * Our middleware function Verify roles utilizes this 
 * object to compare against the user that is currently logged 
 * into the application. 
 */

const ROLES_LIST = {
    "Admin": 7777,
    "Editor": 1984,
    "User": 1001
}

module.exports = ROLES_LIST