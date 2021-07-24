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
        method: "POST",
      url: "/test",
      context: document.body,
    //   data: {"param": addressDetails},
      data: $('form').serialize(),
      dataType: "text",

      success: function (response) {
               console.log(response);
      },
      error: function(error){
             console.log(error);
      }
    }).done(function (data) {
       console.log(data);
      });
    
    // $.ajax({
    //     method: "GET",
    //   url: "../py/zoopla.py",
    //   context: document.body,
    //   data: {"address": addressDetails},
    //   dataType: "text",
    //   success: function(result){
    //     var data=JSON.parse(result);
    //     console.log(result);
    //   }
    // });
    
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

typeof jQuery.typeahead === "function" && 
jQuery.typeahead({
  input: ".js-typeahead",
  minLength: 1,
  backdropOnFocus: true,
  hint: true,
  delay: 200,
  highlight: "any",
  template: function (query, item) {
      spaceChar = "";
      for (var i = 0; i < item.address.length; i++) {
          item.address[i] = spaceChar + item.address[i];
          spaceChar = " ";
      }

      if (item.county != null) {
        item.county = item.county + ", ";
      }

      var myTemplate =
          "<small>{{address}}, {{company}}, {{city}}, {{county}}<em>{{postcode}}</em></small>";
      return myTemplate;
  },
  emptyTemplate:
      "No results found.",
  filter: false,
  dynamic: true,
  display: ["address", "company", "city", "county", "postcode"],
  maxItem: 0,
  loadingAnimation: true,
  source: {
      address: {
          ajax: {
              url: "https://api.addressian.co.uk/v2/autocomplete/{{query}}",
              beforeSend: function (jqXHR, options) {
                  options.url = options.url.replace(/%2C/g, " ");
                  jqXHR.setRequestHeader(
                      "x-api-key","2Rc6ZwcwGQCtaAfFfUV40Oe04eSHRx5nYDndHPh0");
              }
          }
      }
  },
  callback: {
      onSearch: function (node, query) {
          jQuery("#chosen-from-address-autocomplete").fadeOut("slow");
      },
      onClick: function (node, a, item, event) {
          jQuery("#chosen-from-address-autocomplete").html(
              "<strong>Selected address:</strong><br/><br/>" +
              item.address.join(", ")  +
              (item.company != null ? "<br/>" + item.company : "") +
              (item.city != null ? "<br/>" + item.city : "") +
              (item.county != null ? "<br/>" + item.county : "") +
              "<br/>" +
              item.postcode
          );
          jQuery("#chosen-from-address-autocomplete").fadeIn("slow");
      }
  },
  debug: false,
})