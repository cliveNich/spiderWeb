/**
* @method listPartners()
* reads list from partners.json
  sorts list by organization
  selects offices within 100 km of Central London
  (** Note:
   distance can be changed
   by changing value of howFar
  )
  lists offices that match criteria

* tested 24/09/17:
    works in Edge and Firefox
    does not to work in IE and Chrome
*/

  var howFar = 100; // max distance
  var partners;

  function listPartners() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        partners = JSON.parse(this.responseText);
        partners.sort(compare);
        findMatches()
      }
    };
    xmlhttp.open("GET", "partners.json", true);
    xmlhttp.send();
  }

   function compare(a, b) {
    if (a.organization < b.organization) return -1;
    if (a.organization > b.organization) return 1;
    return 0;
  }

  function findMatches() {
    var msg = '';
    for(p in partners) {
      var ofc = '';
      for(q in partners[p].offices) {
        var dist = calcDistance(partners[p].offices[q].coordinates);
        if(dist <= howFar) {
          ofc += "- location: " + partners[p].offices[q].location
            + " (" + Math.round(dist) + " km)<br>"
            + "- address: " + partners[p].offices[q].address + "<p>";
        }
      }
      if(ofc != '') {
        msg += partners[p].organization + "<br>" + ofc;
      }
    }
    var para = document.getElementById("p1");
    para.innerHTML = msg;
  }

  function calcDistance(coords) {
    var xyLon = [51.515419/57.2958, -0.141099/57.2958];
    var xy = coords.split(',');
    xy[0] = xy[0] / 57.2958;
    xy[1] = xy[1] / 57.2958;
    var delPhi = Math.abs(xy[0] - xyLon[0]);
    var delLam = Math.abs(xy[1] - xyLon[1]);
    var havPhi = Math.pow(Math.sin(delPhi / 2), 2);
    var havLam = Math.pow(Math.sin(delLam / 2), 2);
    dist =  6335.439 * 2 * Math.pow(
              Math.asin(havPhi + Math.cos(xy[0]) * Math.cos(xyLon[0]) * havLam)
              , 0.5);
    return(dist);
  }
