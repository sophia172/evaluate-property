jQuery(document).ready(function () {
  var postcodeData;
  var postcodeAddresses;

  jQuery.ajaxSetup({
    headers: {
      "x-api-key": "2Rc6ZwcwGQCtaAfFfUV40Oe04eSHRx5nYDndHPh0"
    }
  });

  jQuery("#postcode-go").click(function () {
    jQuery
      .when(
        jQuery.get(
          "https://api.addressian.co.uk/v2/autocomplete/" +
            jQuery("#postcode").val(),
          function (data) {
            postcodeAddresses = data;
          },
          "json"
        )
      )
      .then(function () {
        var $dropdown = jQuery("#dropdown");
        $dropdown.empty();
        postcodeAddresses.sort();
        jQuery.each(postcodeAddresses, function () {
          var $option = jQuery("<option />");
          $option.text(this.address.join(", ") + ", " + this.postcode);
          $option.data("addressdetails", this);
          $dropdown.append($option);
        });
        $dropdown.fadeIn("slow");
      });
  });

  jQuery("#dropdown").change(function () {
    
    jQuery("#chosen-from-postcode-picker").fadeOut("slow");
    var addressDetails = jQuery(this)
      .children("option:selected")
      .data("addressdetails");
    
    $.ajax({
      url: "../py/zoopla.py",
      context: document.body,
      data: {param: addressDetails}
    }).done(function() {
       alert('finished python script');;
       });

    jQuery("#chosen-from-postcode-picker").html(
      "<strong>Selected address:</strong><br/><br/>" +
        addressDetails.address.join(", ") +
        (addressDetails.company != null
          ? "<br/>" + addressDetails.company
          : "") +
        (addressDetails.city != null ? "<br/>" + addressDetails.city : "") +
        (addressDetails.county != null ? "<br/>" + addressDetails.county : "") +
        "<br/>" +
        addressDetails.postcode
    );
    jQuery("#chosen-from-postcode-picker").fadeIn("slow");
  });
});

