/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        console.log("Device ready");
        // this.receivedEvent('deviceready');
        if(localStorage.getItem("LocalData") == null)
        {
            var data = [];
            data = JSON.stringify(data);
            localStorage.setItem("LocalData", data);
        }
           

    },

    // Update DOM on a Received Event
    // receivedEvent: function(id) {
    //     var parentElement = document.getElementById(id);
    //     var listeningElement = parentElement.querySelector('.listening');
    //     var receivedElement = parentElement.querySelector('.received');

    //     listeningElement.setAttribute('style', 'display:none;');
    //     receivedElement.setAttribute('style', 'display:block;');

    //     console.log('Received Event: ' + id);
    // }
};

app.initialize();
function scan()
{
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if(!result.cancelled)
            {
                if(result.format == "QR_CODE")
                {
                  
                        // var name = input.input1;
                        var value = result.text;

                        var data = localStorage.getItem("LocalData");
                        // console.log(data);
                        alert(value);
                        // alert(typeof value );
                        value = value.split("\"");
                        // alert("split");
                        // alert(value2);
                        // for(var i=2;i<value2.length;++i){
                        //     alert(value2[i]);
                        // }
                        var aadharId = value[5];
                        var name = value[7];
                        var pincode;
                        var yob = value[11];

                        for(var i=value.length-1;i>=0;--i){
                            if(value[i]==" pc="){
                                pincode = value[i+1];
                            }
                        }

                        alert(aadharId);
                        alert(name);
                        alert(yob);
                        alert(pincode);

                        data = JSON.parse(data);
                        data[data.length] = [name, value];

                        localStorage.setItem("LocalData", JSON.stringify(data));

                        alert("Done");
                  
                }
            }
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
   );
}