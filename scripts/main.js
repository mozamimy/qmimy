/** URLの個数　!!!CONSTANT!!! */
var URL_COUNT = 5;

/** 画像のURL */
var imageUrl = new Array();
for (var i = 0; i < URL_COUNT; i++)
{
  imageUrl.push(new Array());
}

/** TumblrのURL */
var tumblrUrl = new Array();
for (var i = 0; i < URL_COUNT; i++)
{
  tumblrUrl.push("http://note.quellencode.org/");
}
 
/** 画像URLのインデックス */
var index = -1;

/** TumblrURLのインデックス */
var tumblrIndex = 0;

/** スライドショータイマ */
var timer;

/** リトライタイマ */
var retryTimer;

/** フェードのインターバル */
var fadeInterval = 1200;

/** フェードを使用するか？ */
var isUseFade = true;

/** XMLをロードしたか？ */
var isLoadedXml = false;

/** 表示間隔 */
var interval = 10;

/** マウスが載っているか？ */
var mouseState = false;

/** 表示方式 */
var showStatus = false;

/* ガジェットのHTML */
System.Gadget.settingsUI = "setting.html";

/**
 * ガジェットがロードされたときの処理（ほぼプログラム本体）
 * @author Moza USANE
 */
function view_onOpen()
{
  System.Debug.outputString(tumblrUrl[0]);
  System.Debug.outputString("view_onOpen()");
  document.imgBox.src = "images/connection_error.png";
  HideControls();

  /* 設定を読み込む */
  ReadSettings();

  /* 変数の初期化 */
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
      /* TumblrのXMLをとってくる */
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

/** 設定の読み込み */
function ReadSettings()
{
  System.Debug.outputString("ReadSettings()");
  if (System.Gadget.Settings.readString("interval") != "")
  {
    System.Debug.outputString("ReadSettings(): Datas exist");
    /* 既に保存データがある場合 */
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
    /* 保存データがない場合 */
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

/** デバッグ用にURLを表示する */
function _debug_showUrl()
{
  System.Debug.outputString("URL");
  System.Debug.outputString(System.Gadget.Settings.readString("url1"));
  System.Debug.outputString(System.Gadget.Settings.readString("url2"));
  System.Debug.outputString(System.Gadget.Settings.readString("url3"));
  System.Debug.outputString(System.Gadget.Settings.readString("url4"));
  System.Debug.outputString(System.Gadget.Settings.readString("url5"));
}

/** コントロールボタンを隠す */
function HideControls()
{
  $(".previousButton").hide();
  $(".centerButton").hide();
  $(".nextButton").hide();
}

/* コントロールボタンを表示する */
function ShowControls()
{
  $(".previousButton").show();
  $(".centerButton").show();
  $(".nextButton").show();
}

/** タイマーをセットする */
function SetTimer()
{
  if (timer != null)
  {
    timer = setInterval(RefreshImage, parseInt(interval) * 1000);
  }
}

/** 画像を更新する */
function RefreshImage()
{
  imgBox.onload = AppearImage;
  index++;
  ChangeImage();
}

/** 画像を変更する */
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

/** イメージを表示する */
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


/** スライドショーのオンオフ */
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

/** 前の画像を表示する */
function ShowPreviousImage()
{
  index--;
  
  temp = isUseFade;
  isUseFade = false;
  ChangeImage();
  isUseFade = temp;
}

/** 次の画像を表示する */
function ShowNextImage()
{
  index++;
  
  temp = isUseFade;
  isUseFade = false;
  ChangeImage();
  isUseFade = temp;
}

/** スライドショーを止める */
function StopSlideShow()
{
  if (showStatus)
  {
    showStatus = false;
    clearInterval(timer);
    document.centerButtonImage.src = "images/play_gray.png";
  }
}

/** オプションが変更されたとき */
function view_onOptionChanged()
{
	tumblrUrl = options("TumblrURL");
	interval = options("interval");
	
	clearInterval(timer);
	view_onOpen();
}

/** マウスオーバーされたとき */
function view_onMouseOver()
{
  /* XMLが読み込まれていればコントロールボタンを表示 */
  if (isLoadedXml)
  {
    ShowControls();
  }
}

/** マウスが離れたとき */
function view_onMouseOut()
{
  /* XMLがロードされているならコントロールボタンを隠す */
  if (isLoadedXml)
  {
   HideControls();
  }
}

/** コントロールボタンにマウスオーバーしたとき */
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

/** 真ん中のボタンにマウスオーバーしたとき */
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

/** 次に進むボタンにマウスオーバーしたとき */
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
  
  /* スライドショーを止める */
  StopSlideShow();
  imgBox.onload = AppearImage;
  ShowNextImage();
}

/** 設定画面が閉じられたとき*/
System.Gadget.onSettingsClosed = onSettingsClosed;
function onSettingsClosed(e)
{
  if (e.closeAction == e.Action.commit)
  {
    /* 設定データをセットする */
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

/** ガジェットが開かれたとき */
System.Gadget.onShowSettings = onShow;
function onShow()
{
  StopSlideShow();
}
