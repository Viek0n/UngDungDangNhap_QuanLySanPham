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

// cho form sản phẩm
export const validateProductForm = (product, availableCategories = []) => {
    const errors = {};

    // --- Tên sản phẩm ---
    if (!product.name || product.name.trim() === '') {
        errors.name = 'Tên sản phẩm không được để trống ❗';
    } 
    else if (product.name.length < 3 || product.name.length > 100) {
        errors.name = 'Tên sản phẩm phải từ 3–100 ký tự ❗';
    }

    // --- Giá ---
    if (product.price == null || product.price === '') {
        errors.price = 'Giá không được để trống ❗';
    } 
    else if (isNaN(product.price)) {
        errors.price = 'Giá phải là số hợp lệ ❗';
    } 
    else if (Number(product.price) <= 0 || Number(product.price) > 999_999_999) {
        errors.price = 'Giá phải > 0 và ≤ 999,999,999 ❗';
    }

    // --- Số lượng ---
    if (product.quantity == null || product.quantity === '') {
        errors.quantity = 'Số lượng không được để trống ❗';
    } 
    else if (isNaN(product.quantity)) {
        errors.quantity = 'Số lượng phải là số ❗';
    } 
    else if (Number(product.quantity) < 0 || Number(product.quantity) > 99_999) {
        errors.quantity = 'Số lượng phải từ 0–99,999 ❗';
    }

    // --- Mô tả ---
    if (product.description && product.description.length > 500) {
        errors.description = 'Mô tả không được vượt quá 500 ký tự ❗';
    }

    // --- Category ---
    if (!product.category || product.category.trim() === '') {
        errors.category = 'Vui lòng chọn category ❗';
    } 
    else if (availableCategories.length > 0 && !availableCategories.includes(product.category)) {
        errors.category = 'Category không hợp lệ ❗';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
