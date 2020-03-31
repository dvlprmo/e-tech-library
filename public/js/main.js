setTimeout(() => {
    $(".alert").hide(2000, function () { // animation for hiding
        $(this).fadeOut("slow");
    });
}, 2000);