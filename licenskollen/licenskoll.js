licenses = [{"id": "Own", "label": "Egenutvecklad"},
	    {"id": "PD", "label": "Public domain"},
	    {"id": "BSDorig", "label": "Original BSD (4-clause)"},
	    {"id": "BSDnew", "label": "New BSD (3-clause)"},
	    {"id": "BSDsimple", "label": "Simplified BSD (2-clause)"},
	    {"id": "LGPLv21", "label": "GNU LGPL v2.1"},
	    {"id": "GPLv2", "label": "GNU GPL v2"},
	    {"id": "GPLv3", "label": "GNU GPL v3"},
	    {"id": "Affero", "label": "Affero GPLv3"}]
	    
function addRow() {
  form = $('form .form-group');
  var lastField = $("form .form-group div:last");
  var intId = (lastField && lastField.length && lastField.data("idx") + 1) || 1;
  var fieldWrapper = $("<div class=\"fieldwrapper form-row\"/ id=\"field" + intId + "\"/>");
  fieldWrapper.data("idx", intId);
  var fName = $("<div class=\"col\"><input type=\"text\" class=\"fieldname form-control\" placeholder=\"Kodbas/komponent\"/></div>");
  var fType = $("<select class=\"license form-control\"></select>");
  for (var idx in licenses) {
    fType.append($("<option value=\"" + licenses[idx].id + "\">" + licenses[idx].label + "</option>"));
  }
  fType.change(function() {
    checkCompliance();
  });
  var removeButton = $("<div><button type=\"button\" class=\"form-control remove\" style=\"width: 40px;\"><i class=\"fas fa-minus-circle\"></button></div>");
  removeButton.click(function() {
    $(this).parent().remove();
    checkCompliance();
  });
  fieldWrapper.append(fName);
  fTypeContainer = $("<div class=\"col\"></div>");
  fTypeContainer.append(fType);
  fieldWrapper.append(fTypeContainer);
  fieldWrapper.append(removeButton);
  form.append(fieldWrapper);
  return false;
}

function checkCompliance() {
  stat = {"type": "info", "header": "Nu kör vi", "text": "Lägg till en eller flera komponenter och ange vilken licens som gäller för var och en"};
  usage = {}
  for (var idx in licenses) {
    usage[licenses[idx].id] = false;
  }
  $('select').each(function(idx) {
    usage[this.value] = true;
  });
  if (usage.BSDorig && (usage.GPLv2 || usage.GPLv3 || usage.Affero)) {
    stat.type = "danger";
    stat.header = "Inkompatibilitet";
    stat.text = "Original BSD-licensen kräver att marknadsföring av resultatet inkluderar information om den licensierade komponenten; GPL-licenser är inte kompatibla med detta villkor.";
  } else if (usage.Affero) {
    stat.type = "warning";
    stat.header = "Viral licens (SaaS)";
    stat.text = "Affero GPLv3 kräver att källkoden görs tilgänglig även när mjukvaran inte distribueras utan endast tillhandahålls som tjänst.";
  } else if (usage.GPLv2 || usage.GPLv3) {
    stat.type = "warning";
    stat.header = "Viral licens";
    stat.text = "En eller fler av komponenterna använder en viral (copyleft) licens, vilket kräver att slutresultatet distribueras med samma licens.";
  } else if (usage.LGPLv21 && usage.Own) {
    stat.type = "warning";
    stat.header = "Svagt viral licens";
    stat.text = "LGPL kan kombineras med andra licenser, men kräver att ändringar i den kod som är licenserad under LGPL görs tillgänglig under samma villkor."
  } else if ($("select").length >= 2) {
    stat.type = "success";
    stat.header = "Det ser bra ut";
    stat.text = "Inga problem med licenskompatibilitet upptäckta.";
  }
  
  $('#compliancestatus').empty();
  $('#compliancestatus').removeClass();
  $('#compliancestatus').addClass('bd-callout bd-callout-' + stat.type);
  $('#compliancestatus').append($("<h4>" + stat.header + "</h3>"));
  $('#compliancestatus').append($("<p>" + stat.text + "</p>"));
};

$(document).ready(function () {
  $('#addrow').click(addRow);
  addRow();
  checkCompliance();
});

