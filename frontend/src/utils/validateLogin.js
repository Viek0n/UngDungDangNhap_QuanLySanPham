// cho form đăng nhập
export const validateLoginForm = (username, password) => {
    const errors = {};

    // USERNAME
    if (!username || username.trim() === '') {
        errors.username = 'Vui lòng nhập tên đăng nhập ❗';
    } 
    else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.username = 'Tên đăng nhập không được chứa ký tự đặc biệt ❗';
    }

    // PASSWORD
    if (!password || password.trim() === '') {
        errors.password = 'Vui lòng nhập mật khẩu ❗';
    } 
    else if (password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự ❗';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
