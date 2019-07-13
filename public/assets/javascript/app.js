// function to submit form to add and delete comments
$(document).ready(function () {

  // Nav Bar Mobile Slider
  $(".button-collapse").sideNav();


  // Click Listener for submission
  $('.add-comment-button').on('click', function () {

    //get ID
    var articleId = $(this).data("id");

    //URL root
    var baseURL = window.location.origin;

    // Get data using ID
    var frmName = "form-add-" + articleId;
    var frm = $('#' + frmName);

    // AJAX call
    $.ajax({
      url: baseURL + '/add/comment/' + articleId,
      type: 'POST',
      data: frm.serialize(),
    })
      .done(function () {

        location.reload();
      });

    return false;
  });

  // Delete comment with a click listener
  $('.delete-comment-button').on('click', function () {

    //Get ID
    var commentId = $(this).data("id");

    // URL
    var baseURL = window.location.origin;

    // AJAX call is used to delete
    $.ajax({
      url: baseURL + '/remove/comment/' + commentId,
      type: 'POST',
    })
      .done(function () {

        location.reload();
      });

    return false;

  });

});