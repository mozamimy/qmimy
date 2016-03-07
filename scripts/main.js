var URL_COUNT = 5;

var imageUrl = new Array();
for (var i = 0; i < URL_COUNT; i++)
{
  imageUrl.push(new Array());
}

var tumblrUrl = new Array();
for (var i = 0; i < URL_COUNT; i++)
{
  tumblrUrl.push("http://note.quellencode.org/");
}

var index = -1;
var tumblrIndex = 0;
var timer;
var retryTimer;
var fadeInterval = 1200;
var isUseFade = true;
var isLoadedXml = false;
var interval = 10;
var mouseState = false;
var showStatus = false;

System.Gadget.settingsUI = "setting.html";

function view_onOpen()
{
  System.Debug.outputString(tumblrUrl[0]);
  System.Debug.outputString("view_onOpen()");
  document.imgBox.src = "images/connection_error.png";
  HideControls();

  ReadSettings();

  System.Debug.outputString("Init variables");
  clearTimeout(retryTimer);
  clearInterval(timer);
  isLoadedXml = false;
  showStatus = false;
  index = -1;

  System.Debug.outputString("Begin Main Loop");
  for (var l = 0; l < URL_COUNT; l++)
  {
    var imageCache = new Array();
    System.Debug.outputString("peropero");

    try
    {
      httpClient = new XMLHttpRequest();
      httpClient.open("GET", tumblrUrl[l] + "api/read?type=photo&num=50", false);
      httpClient.setRequestHeader("If-Modified-Since", "Thu, 01 Jun 1970 00:00:00 GMT");
      httpClient.send(null);

      if (httpClient.status == 200)
      {
        var domRoot = httpClient.responseXML;
        for (var i = 0; domRoot.childNodes[1].childNodes[i] != null; i++)
        {
          var element = domRoot.childNodes[1].childNodes[i];
          if (element.nodeName == "posts")
          {
            for (var j = 0; element.childNodes[j] != null; j++)
            {
              var element2 = element.childNodes[j];
              for (var k = 0; element2.childNodes[k] != null; k++)
              {
                var element3 = element2.childNodes[k];
                if (element3.nodeName == "photo-url")
                {
                  var attribute = element3.getAttribute('max-width');
                  if (attribute == "400")
                  {
                    imageUrl[l].push("" + element3.firstChild.nodeValue);
                    //System.Debug.outputString(imageUrl[l]);
                  }
                }
              }
            }
          }
        }

        showStatus = true;
        timer = setInterval(RefreshImage, parseInt(interval) * 1000);
        isLoadedXml = true;
        RefreshImage();
      }
      else
      {
        document.imgBox.src = "images/connection_error.gif";
        retryTimer = setTimeout(view_onOpen, 5000);
      }
    }
    catch (e)
    {
      document.imgBox.src = "images/connection_error.gif";
      retryTimer = setTimeout(view_onOpen, 5000);
    }
  }
}

function ReadSettings()
{
  System.Debug.outputString("ReadSettings()");
  if (System.Gadget.Settings.readString("interval") != "")
  {
    System.Debug.outputString("ReadSettings(): Datas exist");
    tumblrUrl[0] = System.Gadget.Settings.readString("url1");
    tumblrUrl[1] = System.Gadget.Settings.readString("url2");
    tumblrUrl[2] = System.Gadget.Settings.readString("url3");
    tumblrUrl[3] = System.Gadget.Settings.readString("url4");
    tumblrUrl[4] = System.Gadget.Settings.readString("url5");
    interval = parseInt(System.Gadget.Settings.readString("interval"));
    isUseFade = System.Gadget.Settings.read("isUseFade");
  }
  else
  {
    System.Debug.outputString("ReadSettings(): Datas not exist");
    System.Gadget.Settings.writeString("url1", tumblrUrl[0]);
    System.Gadget.Settings.writeString("url2", tumblrUrl[1]);
    System.Gadget.Settings.writeString("url3", tumblrUrl[2]);
    System.Gadget.Settings.writeString("url4", tumblrUrl[3]);
    System.Gadget.Settings.writeString("url5", tumblrUrl[4]);
    System.Gadget.Settings.writeString("interval", interval);
    System.Gadget.Settings.write("isUseFade", isUseFade);
  }

  _debug_showUrl();
}

function _debug_showUrl()
{
  System.Debug.outputString("URL");
  System.Debug.outputString(System.Gadget.Settings.readString("url1"));
  System.Debug.outputString(System.Gadget.Settings.readString("url2"));
  System.Debug.outputString(System.Gadget.Settings.readString("url3"));
  System.Debug.outputString(System.Gadget.Settings.readString("url4"));
  System.Debug.outputString(System.Gadget.Settings.readString("url5"));
}

function HideControls()
{
  $(".previousButton").hide();
  $(".centerButton").hide();
  $(".nextButton").hide();
}

function ShowControls()
{
  $(".previousButton").show();
  $(".centerButton").show();
  $(".nextButton").show();
}

function SetTimer()
{
  if (timer != null)
  {
    timer = setInterval(RefreshImage, parseInt(interval) * 1000);
  }
}

function RefreshImage()
{
  imgBox.onload = AppearImage;
  index++;
  ChangeImage();
}

function ChangeImage()
{
  if (index > 49)
  {
    index = 0;
  }
  else if (index < 0)
  {
    index = 49;
  }

  clearInterval(timer);
  $(".imgBox").hide();
  document.imgBox.src = imageUrl[index];
}

function AppearImage()
{
  imgBox.onload = null;

  if (isUseFade)
  {
    $(".imgBox").fadeIn(fadeInterval);
  }
  else
  {
   $(".imgBox").show();
  }

  if (showStatus)
  {
    SetTimer();
    imgBox.onload = null;
  }
}


function ToggleViewState()
{
  if (showStatus)
  {
    showStatus = false;
    clearInterval(timer);
    document.centerButtonImage.src = "images/play_white.png";
  }
  else
  {
    showStatus = true;
    SetTimer();
    document.centerButtonImage.src = "images/stop_white.png";
  }
}

function ShowPreviousImage()
{
  index--;

  temp = isUseFade;
  isUseFade = false;
  ChangeImage();
  isUseFade = temp;
}

function ShowNextImage()
{
  index++;

  temp = isUseFade;
  isUseFade = false;
  ChangeImage();
  isUseFade = temp;
}

function StopSlideShow()
{
  if (showStatus)
  {
    showStatus = false;
    clearInterval(timer);
    document.centerButtonImage.src = "images/play_gray.png";
  }
}

function view_onOptionChanged()
{
  tumblrUrl = options("TumblrURL");
  interval = options("interval");

  clearInterval(timer);
  view_onOpen();
}

function view_onMouseOver()
{
  if (isLoadedXml)
  {
    ShowControls();
  }
}

function view_onMouseOut()
{
  if (isLoadedXml)
  {
   HideControls();
  }
}

function previous_onMouseOver()
{
  document.previousButtonImage.src = "images/previous_white.png";
  document.previousButtonImage.style.cursor = "hand";
}

function previous_onMouseOut()
{
  document.previousButtonImage.src = "images/previous_gray.png";
  document.previousButtonImage.style.cursor = "default";
}

function previous_onMouseDown()
{
  document.previousButtonImage.style.zoom = "105%";
}

function previous_onMouseUp()
{
  document.previousButtonImage.style.zoom = "100%";

  StopSlideShow();
  imgBox.onload = AppearImage;
  ShowPreviousImage();
}

function center_onMouseOver()
{
  if (showStatus)
  {
    document.centerButtonImage.src = "images/stop_white.png";
  }
  else
  {
    document.centerButtonImage.src = "images/play_white.png";
  }
  document.centerButtonImage.style.cursor = "hand";
}

function center_onMouseOut()
{
  if (showStatus)
  {
    document.centerButtonImage.src = "images/stop_gray.png";
  }
  else
  {
    document.centerButtonImage.src = "images/play_gray.png";
  }
  document.centerButtonImage.style.cursor = "default";
}

function center_onMouseDown()
{
  document.centerButtonImage.style.zoom = "105%";
  ToggleViewState();
}

function center_onMouseUp()
{
  document.centerButtonImage.style.zoom = "100%";
}

function next_onMouseOver()
{
  document.nextButtonImage.src = "images/next_white.png";
  document.nextButtonImage.style.cursor = "hand";
}

function next_onMouseOut()
{
  document.nextButtonImage.src = "images/next_gray.png";
  document.nextButtonImage.style.cursor = "default";
}

function next_onMouseDown()
{
  document.nextButtonImage.style.zoom = "105%";
}

function next_onMouseUp()
{
  document.nextButtonImage.style.zoom = "100%";

  StopSlideShow();
  imgBox.onload = AppearImage;
  ShowNextImage();
}

System.Gadget.onSettingsClosed = onSettingsClosed;
function onSettingsClosed(e)
{
  if (e.closeAction == e.Action.commit)
  {
    tumblrUrl[0] = System.Gadget.Settings.readString("url1");
    tumblrUrl[1] = System.Gadget.Settings.readString("url2");
    tumblrUrl[2] = System.Gadget.Settings.readString("url3");
    tumblrUrl[3] = System.Gadget.Settings.readString("url4");
    tumblrUrl[4] = System.Gadget.Settings.readString("url5");
    interval = parseInt(System.Gadget.Settings.readString("interval"));
    isUseFade = System.Gadget.Settings.read("isUseFade");

    /* Debug */
    System.Debug.outputString("設定画面が閉じられました");
    System.Debug.outputString(System.Gadget.Settings.readString("url1");
    System.Debug.outputString(System.Gadget.Settings.readString("url2");
    System.Debug.outputString(System.Gadget.Settings.readString("url3");
    System.Debug.outputString(System.Gadget.Settings.readString("url4");
    System.Debug.outputString(System.Gadget.Settings.readString("url5");
  }

  StopSlideShow();
  view_onOpen();
}

System.Gadget.onShowSettings = onShow;
function onShow()
{
  StopSlideShow();
}
