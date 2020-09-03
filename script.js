$(document).ready(function() {
  $("#domValue").click(function() {
    if (document.getElementById("csvCheck").checked == true) {
      var str = $("#dom").val().split(',');
    }
    else {
    var str = $("#dom").val().split('\n');
    }
    if (str.length > 0) {
      $("#bulk").removeClass('hide');
    }
    console.log(str)
    // alert(str);

     function sleep() {
          setTimeout(function() {  
             console.log("waiting"); 
          }, 240000);
     }

    for (i = 0; i < str.length; ++i) {
      
        $.getJSON('https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.godaddy.com/v1/appraisal/' + str[i]), function(data) {
         var gd = JSON.parse(data.contents);
         var sales = '';

         if (gd.status != "OK" || gd.status != "UNSUPPORTED_DOMAIN" || gd.status != "MASKED_DOMAIN" || gd.status == "SLOW_DOWN") {
            sleep();
        }

       
        if(gd.domain != undefined && gd.govalue != undefined) {
          
           if (document.getElementById("compare").checked == true) {
          for (j=0; j<gd.comparable_sales.length; ++j) {
              sales += "<tr><td>"+gd.comparable_sales[j].year+" <td>"+gd.comparable_sales[j].domain+"</td><td> $"+gd.comparable_sales[j].price+"</td></tr>";
          }
        txt = "<tr><th scope=\"row\">" + gd.domain + "</th><td>" + gd.govalue + "</td><td><table style=\"text-align: centre\">" + "<thead scope=\"row\"><th >Year</th><th >Domain</th><th>Sale Price</th></thead><tbody>" + sales + "</tbody></table></td></tr>";}
          else {
            $("#remove").remove();
            txt = "<tr><td>" + JSON.parse(data.contents).domain + "</td><td>" + JSON.parse(data.contents).govalue + "</td></tr>";
          }
        
        $("#bulk").append(txt);
        document.querySelector('#bulk').scrollIntoView({
  behavior: 'smooth' 
});
}
      });

    }
  });

});

/* CSV Import code */

function download_csv(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV FILE
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // We have to create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Make sure that the link is not displayed
    downloadLink.style.display = "none";

    // Add the link to your DOM
    document.body.appendChild(downloadLink);

    // Lanzamos
    downloadLink.click();
}

function export_table_to_csv(html, filename) {
	var csv = [];
	var rows = document.querySelectorAll("table tr");
	
    for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");
		
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
		csv.push(row.join(","));		
	}

    // Download CSV
    download_csv(csv.join("\n"), filename);
}

document.getElementById('csv').addEventListener("click", function () {
    var date = new Date();
    var html = document.querySelector("table").outerHTML;
	export_table_to_csv(html, "bulk_appraisal_"+date.getTime()+".csv");
});

// push notification
