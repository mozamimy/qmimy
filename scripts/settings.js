function onShow()
{
  System.Debug.outputString("onShow()");
  System.Debug.outputString(System.Gadget.Settings.readString("url1"));
  System.Debug.outputString(System.Gadget.Settings.readString("url2"));
  System.Debug.outputString(System.Gadget.Settings.readString("url3"));
  System.Debug.outputString(System.Gadget.Settings.readString("url4"));
  System.Debug.outputString(System.Gadget.Settings.readString("url5"));

  document.settingForm.baseUrl1.value = System.Gadget.Settings.readString("url1");
  document.settingForm.baseUrl2.value = System.Gadget.Settings.readString("url2");
  document.settingForm.baseUrl3.value = System.Gadget.Settings.readString("url3");
  document.settingForm.baseUrl4.value = System.Gadget.Settings.readString("url4");
  document.settingForm.baseUrl5.value = System.Gadget.Settings.readString("url5");
  document.settingForm.intervalBox.value = parseInt(System.Gadget.Settings.readString("interval"));
  document.settingForm.isFade.checked = System.Gadget.Settings.read("isUseFade");
}

System.Gadget.onSettingsClosing = onSettingsClosing;
function onSettingsClosing(e)
{
  if (e.closeAction == e.Action.commit)
  {
    var isVailed = true;
    var HTTP = "http://"    /* CONST!!! */

    if (parseInt(document.settingForm.intervalBox.value) < 10 ||
        !isFinite(parseInt(document.settingForm.intervalBox.value)))
    {
      document.settingForm.intervalBox.value = "10";
      AbortCloseWindow(new Array(e), new Array(isVailed));
    }
    if (document.settingForm.baseUrl1.value != "" &&
      document.settingForm.baseUrl1.value.indexOf(HTTP) == -1)
    {
      SetMessageCorrectUrl(document.settingForm.baseUrl1);
      AbortCloseWindow(new Array(e), new Array(isVailed));
    }
    if (document.settingForm.baseUrl2.value != "" &&
      document.settingForm.baseUrl2.value.indexOf(HTTP) == -1)
    {
      SetMessageCorrectUrl(document.settingForm.baseUrl2);
      AbortCloseWindow(new Array(e), new Array(isVailed));
    }
    if (document.settingForm.baseUrl3.value != "" &&
      document.settingForm.baseUrl3.value.indexOf(HTTP) == -1)
    {
      SetMessageCorrectUrl(document.settingForm.baseUrl3);
      AbortCloseWindow(new Array(e), new Array(isVailed));
    }
    if (document.settingForm.baseUrl4.value != "" &&
      document.settingForm.baseUrl4.value.indexOf(HTTP) == -1)
    {
      SetMessageCorrectUrl(document.settingForm.baseUrl4);
      AbortCloseWindow(new Array(e), new Array(isVailed));
    }
    if (document.settingForm.baseUrl5.value != "" && 
      document.settingForm.baseUrl5.value.indexOf(HTTP) == -1)
    {
      SetMessageCorrectUrl(document.settingForm.baseUrl5);
      AbortCloseWindow(new Array(e), new Array(isVailed));
    }

    if (isVailed)
    {
      WriteSettings();
    }
  }
}

function WriteSettings()
{
  System.Gadget.Settings.writeString("interval", document.settingForm.intervalBox.value);
  System.Gadget.Settings.write("isUseFade", document.settingForm.isFade.checked);
  System.Gadget.Settings.writeString("url1", document.settingForm.baseUrl1.value);
  System.Gadget.Settings.writeString("url2", document.settingForm.baseUrl2.value);
  System.Gadget.Settings.writeString("url3", document.settingForm.baseUrl3.value);
  System.Gadget.Settings.writeString("url4", document.settingForm.baseUrl4.value);
  System.Gadget.Settings.writeString("url5", document.settingForm.baseUrl5.value);
}

function SetMessageCorrectUrl(input)
{
  input.value = "ここに正しいURLをいれてください";
}

function AbortCloseWindow(e, isVailed)
{
  e[0].cancel = true;
  isVailed[0] = false;
}
