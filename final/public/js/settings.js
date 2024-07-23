// On Loading of the page
$(() => {
    const clearSearchHistoryBtn = $("#clearSearchHistoryBtn");

    // Called when the Clear button is clicked
    clearSearchHistoryBtn.click((e) => {
        $.post("/user/settings/history", {shouldClear: true});
    });

    const mottoBtn = $("#updateMottoBtn");

    // Called when the Motto button is clicked
    mottoBtn.click((e) => {
        const mottoInput = $("#mottoInput");
        $.post("/user/settings/description", {description: mottoInput.val()});
    });

    const passwordBtn = $("#updatePasswordBtn");

    // Called when the Password button is clicked
    passwordBtn.click((e) => {
        const passwordInput = $("#passwordInput");
        const confirmPasswordInput = $("#confirmPasswordInput");

        if (passwordInput.val() == confirmPasswordInput.val()) {
            $.post("/user/settings/password", {password: passwordInput.val()});
        }
    });
});