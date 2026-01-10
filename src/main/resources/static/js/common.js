const userIdRegex = /^[A-Za-z0-9]{6,25}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#()\-=+])[A-Za-z\d@$!%*?&#()\-=+]{10,}$/;
const birthDateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
const phoneNumberRegex =  /^[0-9]{10,11}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;