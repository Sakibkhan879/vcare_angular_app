import { Component, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { BizBotService } from '../../services/bot.service';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../services/report.service';
import { UtilityService } from '../../services/utility.service';
declare var $;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements AfterViewInit, OnInit {
  chatInitialData: any = {};
  userData: any = {};
  bizChat: any[] = [];
  botLoading: boolean = false;
  botCustomerList: any[] = [];
  interimData: any = {};
  isInputDataWaiting: boolean = false;
  chatInput: string = "";
  currentBotChatDataIndex: number = 0;
  initialBotButton: any[] = [];

  constructor(
    private botService: BizBotService,
    private reportService: ReportService,
    private toastr: ToastrService,
    public cdr: ChangeDetectorRef,
    private utilityService: UtilityService) {
    if (localStorage["userdata"]) {
      this.userData = JSON.parse(localStorage["userdata"]);
    }
  }


  ngOnInit() {
  //  this.loadInitialBotData();
  }


  async ngAfterViewInit() {
    $(".chat-bot-icon").click(function (e) {
      $(this).children('img').toggleClass('hide');
      $(this).children('svg').toggleClass('animate');
      $('.chat-screen').toggleClass('show-chat');
    });
    $('.chat-mail button').click(function () {
      $('.chat-mail').addClass('hide');
      $('.chat-body').removeClass('hide');
      $('.chat-input').removeClass('hide');
      $('.chat-header-option').removeClass('hide');
    });
    //$('.end-chat').click(function () {
    //  $('.chat-body').addClass('hide');
    //  $('.chat-input').addClass('hide');
    //  $('.chat-session-end').removeClass('hide');
    //  $('.chat-header-option').addClass('hide');
    //});

    //var prom = this.utilityService.getAccessData().toPromise();
    //var result = await prom;
    //if (result && result.length > 0) {
    //  var _data = result;
    //  if (_data.includes("bizbot")) {
    //  } else {
    //    $("#bizbotmain").remove();
    //  }
    //} else {
    //  $("#bizbotmain").remove();
    //}
  }

  loadInitialBotData() {
    this.chatInitialData = [];
    this.initialBotButton = [];
    var botprom = this.botService.getInitalChatSetup();
    botprom.subscribe(result => {
      if(result && result.status && result.data.chatdata)
        this.chatInitialData = result.data.chatdata[0];
      this.initialBotButton = result.data.buttonlist;
      this.bizChat.push({ chatinfo: this.chatInitialData, from: "biz", buttonlist: this.initialBotButton });
      this.gotoChatBottom();
    });
  }

  buttonClickedChatBot(chatdata, buttondata) {

    if (buttondata.actiontype == "report") {

      this.openPdf(buttondata);
    }
    else {
      var objectToSend = chatdata;

      var selected = { messagetext: (chatdata.chatinfo.messagetype == 'user_input') ? chatdata.additionalinfo.datatext : buttondata.buttontext };

      if (selected.messagetext) {
        /*
         * only push if text is not empty. As we are using button text for some addition logical implementation.
         * So we dont want empty strings to be entered in the conversation
        */

        this.bizChat.push({ chatinfo: selected, from: "user", buttonlist: [] });
        this.gotoChatBottom();
      }

      objectToSend.buttondetails = buttondata;

      this.botLoading = true;
      this.gotoChatBottom();
      var _prom = this.botService.companyChatBotTransaction(objectToSend, buttondata.api);
      _prom.success(result => {
        this.botLoading = false;
        if (result && result.status && result.data) {
          var chatinforesponse = result.data.chatdata[0];
          var buttondataresponse = result.data.buttonlist;
          if (chatinforesponse.messagetype == "user_input") {
            this.loadInterimInputData(chatinforesponse, buttondataresponse);
          }
          else
            this.bizChat.push({ chatinfo: chatinforesponse, from: "biz", buttonlist: buttondataresponse });
            this.gotoChatBottom();
          this.currentBotChatDataIndex = this.bizChat.length - 1;
          if (chatinforesponse.messagetype == "user_input_chat") {
            this.isInputDataWaiting = true;
          }
        }
        else {
          this.bizChat.push({ chatinfo: { messagetext: "I am waiting on my server. PLease wait, looks like some issue" }, from: "biz", buttonlist: [] });
          this.gotoChatBottom();
        }
      });
    }
    
  


  }

  loadInterimInputData(chatdata, buttondata) {
    this.botLoading = true;
    this.gotoChatBottom();
    if (this.interimData.length > 0) {
      chatdata.interimdata = this.interimData;
      this.bizChat.push({ chatinfo: chatdata, from: "biz", buttonlist: buttondata });
      this.botLoading = false;
      this.interimData = [];
      this.gotoChatBottom();
    }
    else {
      var _prom = this.botService.companyChatBotTransaction(chatdata, chatdata.api);
      _prom.success(result => {
        this.botLoading = false;
        if (result && result.status && result.data) {
          chatdata.interimdata = result.data;
          this.bizChat.push({ chatinfo: chatdata, from: "biz", buttonlist: buttondata });
          this.currentBotChatDataIndex = this.bizChat.length - 1;
          this.gotoChatBottom();
        }
        else {
          this.bizChat.push({ chatinfo: { messagetext: "I am waiting on my server. PLease wait, looks like some issue" }, from: "biz", buttonlist: [] });
          this.gotoChatBottom();
        }
      });
    }
  


  }




  openPdf(data) {
    var pdfProm = this.reportService.reportPromise({ [data.reportparam]: data.buttondata, reportname: data.reportname });
    pdfProm.subscribe(result => {
      if (result.data) {
        var byte = this.utilityService.base64ToArrayBuffer(result.data);
        var blob = new Blob([byte], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, '_blank');
      }
      else {
        
      }
    })
  }


  userChatInputSignal() {
    this.isInputDataWaiting = false;
    var selected = { messagetext: this.chatInput };

    var chatdata = this.bizChat[this.currentBotChatDataIndex].chatinfo;
    var buttondata = this.bizChat[this.currentBotChatDataIndex].buttonlist[0];

    if (!chatdata.additionalinfo) {
      chatdata.additionalinfo = {};
    }
    chatdata.additionalinfo.userinputtext = this.chatInput;
    chatdata.buttondetails = buttondata;

    this.bizChat.push({ chatinfo: selected, from: "user", buttonlist: [] });
    this.botLoading = true;
    this.gotoChatBottom();
    var _prom = this.botService.companyChatBotTransaction(chatdata, chatdata.api);
    _prom.success(result => {
      this.botLoading = false;
      if (result && result.status && result.data) {
        if (chatdata.chatdomaintype == "interim_data") {
          this.interimData = result.data;
        }

        if (buttondata.actiontype == "user_input_callback") {
          this.buttonClickedChatBot(this.bizChat[this.currentBotChatDataIndex], buttondata);
        }

      }
      else {
        this.bizChat.push({ chatinfo: { messagetext: "I am waiting on my server. PLease wait, looks like some issue" }, from: "biz", buttonlist: [] });
        this.gotoChatBottom();
      }
    });

    this.chatInput = "";

  }

  gotoChatBottom() {
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    //var element = document.getElementById("bizBotChatBody");
    //element.scrollTop = element.scrollHeight +10;
    var div = document.getElementById("bizBotChatBody");
    $('#bizBotChatBody' ).animate({
      scrollTop: div.scrollHeight - div.clientHeight
    }, 500);
   // $("#bizBotChatBody").scrollTop($("#bizBotChatBody")[0].scrollHeight);
  }

  resetBot() {
    this.bizChat = [];
    this.bizChat.push({ chatinfo: this.chatInitialData, from: "biz", buttonlist: this.initialBotButton });
    this.gotoChatBottom();
  }


  title = 'kantaserp1';
}
