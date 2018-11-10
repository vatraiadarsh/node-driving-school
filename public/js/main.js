 function showRequest() {
  $("[type=submit]").attr("disabled", true)
  return true;
}
function showResponse(response)  {
  console.log(response)
  $("[type=submit]").attr("disabled", false)
  if(response.status == true) {
    swal("Good Job!", response.message, "success")
    if(response.redirect)
      window.location.href = response.redirect;
  } else {
    swal("Opps!", response.message, "error")
  }
}
$(function() {
  var options = {
    beforeSubmit:  showRequest,
    success:       showResponse
 };
 $('.ajaxForm').ajaxForm(options);

 // for ajax click
 $(document).on("click",".ajaxClick", function(e) {
   e.preventDefault()
   var href = $(this).attr("href")
   if($(this).hasClass('noDialog'))
     var dialog = true
   else
     var dialog = confirm("Are you sure?")
   if(dialog == true) {
     $.ajax({
       url: href,
       success: function(response) {
         if(response.status == true) {
           swal("Good Job!", response.message, "success")
           if(response.redirect)
             window.location.href = response.redirect;
         } else {
           swal("Opps!", response.message, "error")
         }
       }
     })
   } else {
     swal("You are safe!!","Your data is safe!","success")
   }
 })

 // For adding new sysmto text field
 $(document).on("click","#add_new_payment_field", function(e) {
   var html = '<div class="input-group form-group">\
     <input type="text" name="payments[]" class="form-control" placeholder="Enter symptoms">\
     <span class="input-group-addon click_to_close">\
       <i class="fa fa-times"></i> (Clear)\
     </span>\
   </div>'
   $("#payments").append(html)
 })

 // Location picker
 $('#map').locationpicker({
       location: {
           latitude: 27.7153902,
           longitude: 85.31232929999999
       },
       enableAutocomplete: true,
       inputBinding: {
           latitudeInput: $('[name=latitude]'),
           longitudeInput: $('[name=longitude]'),
           radiusInput: null,
           locationNameInput: $('#location')
       },
       enableAutocompleteBlur: true,       
       addressFormat: 'sublocality',
       zoom: 15
   });

 // For clearing the row input from symptoms
 $(document).on("click",".click_to_close", function() {
   $(this).parent().remove()
 })
 // Select2
 $('[name="payments[]"] option').val(function(idx, val) {
   $(this).siblings("[value='"+ val +"']").remove();
 });
})
