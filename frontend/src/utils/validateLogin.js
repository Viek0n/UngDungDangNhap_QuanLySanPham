// cho form đăng nhập
export const validateLogin = (username, password) => {
    const errors = {};

    // USERNAME
    if (!username || username.trim() === '') {
        errors.username = 'Vui lòng nhập tên đăng nhập ❗';
    } 
    else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.username = 'Tên đăng nhập không được chứa ký tự đặc biệt ❗';
    }else if(username.length < 3 || username.length > 50){
        errors.username = 'Tên đăng nhập phải dài 3-50 ký tự ❗';
    }

    // PASSWORD
    if (!password || password.trim() === '') {
        errors.password = 'Vui lòng nhập mật khẩu ❗';
    } 
    else if (password.length < 6 || password.length > 100) {
        errors.password = 'Mật khẩu phải dài 6-100 kí tự ❗';
    }
    else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
        errors.password = 'Mật khẩu phải chứa cả chữ và số ❗';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
