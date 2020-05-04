'use strict'

$('.show-edit-form').click(function(){
    $(this).hide();
    $('form').toggleClass('hidden');
})

function deleted(){
    alert('Book has been deleted.');
}