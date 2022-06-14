
    function waitForElm(selector) {
        return new Promise(function (resolve) {
            if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
            }

            var observer = new MutationObserver(function (mutations) {
            if (document.querySelector("#formDisplay")) {
                resolve(document.querySelector("#formDisplay"));
                observer.disconnect();
            }
            });
            observer.observe(document.body, {
            childList: true,
            subtree: true
            });
        });
    }

    waitForElm("#formDisplay").then(function (elm) {
        console.log("form ready to load");
        loadElementForm();
    });
    
    function loadElementForm() {
    
        document.querySelector("#formDisplay").innerHTML = '<form id="mmForm"><h2>Submit a request</h2><label for="custEmail">Email</label><input type="text" name="CustomerEmail" id="custEmail" class="required" ><label for="custSubject">Subject</label><input type="text" name="CustomerSubject" id="custSubject" class="required" ><label for="custDescription">Description</label><textarea name="CustomerDescription" id="custDescription" cols="30" rows="10" class="required" ></textarea>\n<label for="custFirstName">First Name</label>\n<input type="text" name="FirstName" id="custFirstName" zendeskID="5071123245981" class="required" class="required" ><label for="custLastName">Last Name</label><input type="text" name="LastName" id="custLastName" zendeskID="5071165731485" class="required" ><label for="custPhoneNumber">Phone Number</label><input type="text" name="PhoneNumber" id="custPhoneNumber" zendeskID="5071154357405" class="required">\n<label for="custAddress">Address</label>\n<textarea name="CustomerAddress" id="custAddress" cols="30" rows="10" zendeskID="5071182218013" class="required"></textarea>\n<label for="custPostCode">Postcode</label>\n<input type="text" name="PostCode" id="custPostCode" zendeskID="5071182790557">\n<label for="howCanWehelp">How can we help you?</label>\n<select name="HowCanWeHelp" id="howCanWehelp">\n    <option value="">-</option>\n    <option value="password_reset">Password Reset</option>\n    <option value="noise_driver_complaint">Noise/Driver Complaint</option>\n    <option value="missing_delivery">Missing Delivery</option>\n    <option value="incorrect_delivery">Incorrect Delivery</option>\n    <option value="payment_enquiry">Payment Enquiry</option>\n    <option value="order_enquiry">Order Enquiry</option>\n    <option value="feedback">Feedback</option>\n</select>\n<input type="button" id="contactButton" value="Submit">\n</form>\n<p id="results" style="display:none">Thank you for submitting</p>';

        var zendeskEndPoint = "https://mmsupport-tpuk.zendesk.com/api/v2/requests";
        var contactButton = document.querySelector("#contactButton");
        var mmForm = document.querySelector("#mmForm"); //Form fields

        var custEmail = document.querySelector("#custEmail");
        var custSubject = document.querySelector("#custSubject");
        var custDescription = document.querySelector("#custDescription");
        var custFirstName = document.querySelector("#custFirstName");
        var custLastName = document.querySelector("#custLastName");
        var custAddress = document.querySelector("#custAddress");
        var custPhoneNumber = document.querySelector("#custPhoneNumber");
        var custPostCode = document.querySelector("#custPostCode");
        var howCanWehelp = document.querySelector("#howCanWehelp");

        var failedAttempts = 1;
      
        var formResults = document.querySelector("#results");           

        mmForm.addEventListener("submit", function (e) {
        e.preventDefault();
        });
    

        function createRequest() {
        contactButton.disabled = true;
        var completedFormDetails = {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            request: {
                ticket_form_id: 360003304817,
                requester: {
                name: custFirstName.value + " " + custLastName.value,
                email: custEmail.value
                },
                recipient: "contact@milkandmore.co.uk",
                subject: custSubject.value,
                comment: {
                body: custDescription.value
                },
                custom_fields: [
                {
                    id: 5071123245981,
                    value: custFirstName.value
                },
                {
                    id: 5071165731485,
                    value: custLastName.value
                },
                {
                    id: 5071182218013,
                    value: custAddress.value
                },
                {
                    id: 5071182790557,
                    value: custPostCode.value
                },
                {
                    id: 5071154357405,
                    value: custPhoneNumber.value
                },
                {
                    id: 5071172111133,
                    value: howCanWehelp.value
                }
                ]
            }
            })
        }; //console.log(completedFormDetails);

        fetch(zendeskEndPoint, completedFormDetails)
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                console.log(result);

            if (result.error == "RecordInvalid") {
                alert("Please fill in all information");
                mmForm.style.display = 'block';
                contactButton.disabled = false;
            } else {
                document.querySelectorAll('input[type="text"]').forEach(function (e) {
                    return (e.value = "");
                });
                custDescription.value = '';
                howCanWehelp.value = '';
                custAddress.value = ''; 
                formResults.style.display = 'block';
                mmForm.style.display = 'none';
                formResults.innerHTML = "Thank you for submitting your form.";
                
            }
            });
        }

        contactButton.addEventListener("click", function (e) {
            createRequest()
            
        });
    }   
