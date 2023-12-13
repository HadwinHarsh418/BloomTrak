export const Patterns = {
    // email:'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
    password: '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}',
    number : (/^\(\d{3}\)\s\d{3}-\d{4}$/),
    website:'(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]?',
    sort_name:'[A-Za-z]{3}[0-9]{1}'
}

// [A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}