    const widthInput = document.getElementById('width');
        widthInput.addEventListener('input', listenForInput);
        widthInput.addEventListener('propertychange', listenForInput);

        const thicknessInput = document.getElementById('thickness');
        thicknessInput.addEventListener('input', listenForInput);
        thicknessInput.addEventListener('propertychange', listenForInput); 

        const lengthInput = document.getElementById('length');
        lengthInput.addEventListener('input', listenForInput);
        lengthInput.addEventListener('propertychange', listenForInput); 

        const startingtempInput = document.getElementById('startingTemp');
        startingtempInput.addEventListener('input', listenForInput);
        startingtempInput.addEventListener('propertychange', listenForInput);
        const targetTempInput = document.getElementById('targetTemp', listenForInput);
        targetTempInput.addEventListener('input', listenForInput);
        targetTempInput.addEventListener('propertychange', listenForInput);
        finalPropaneHeatingTime = 0;
        finalAcetyleneHeatingTime = 0;
        let workPieceCalc = false;
        let tempCalc = false;
        const errorMessage = document.getElementById('wrongInput');
        const thicknessFiledError = document.getElementById('errorForThickness');
        const lengthFiledError = document.getElementById('errorForLength');



        function listenForInput(e) {
            console.log(e.target.value);

            const isThicknessValid = validateThickness();
            const isLengthValid = validateLength();

            if (isLengthValid) {
                lengthFiledError.style.display = 'none';
                workPieceCalc = true;
            } else {
                lengthFiledError.style.display = 'block';
                workPieceCalc = false;
                return;
            }

            if (isThicknessValid) {
                thicknessFiledError.style.display = 'none';
                workPieceCalc = true;
            } else {
                thicknessFiledError.style.display = 'block';
                workPieceCalc = false;
                return;
            }
            const valid = validateInput();



            if (valid) {
                const result = calculate();
                calculateTemp(result);

            } else {
                console.log("Input not valid");
                workPieceCalc = false;
                tempCalc = false;

                errorMessage.style.display = 'block';

            }

        }

        function validateThickness() {
            console.log("thickness " + thicknessInput.value);   
            console.log(thicknessInput.value === '');
            if (thicknessInput.value === '') {
                return false;
            }
            return true;
        }

        function validateLength() {
            console.log("thickness " + lengthInput.value);   
            console.log(lengthInput.value === '');
            if (lengthInput.value === '') {
                return false;
            }
            return true;
        }



        function validateInput() {

            if (parseInt(widthInput.value) < 75) {
                console.log("Less than minimum");
                return false;
            }

            return true;
        }

        function calculate() {

            let energyNeed = 0;
            let width = document.getElementById('width').value;
            let thickness = document.getElementById('thickness').value;
            let length = lengthInput.value;
            let result = 0;
            if (width < 75) {
                console.log("Width is less than a minimum. Min value 75mm");
                errorMessage.style.display = 'block';
                return;
            }

            errorMessage.style.display = 'none';




            result = (length / 1000 * width * 2 / 1000 * thickness / 1000) * 7850;

            console.log("Workpiece weight:  " + Math.round(result) * 100 / 100);
            document.getElementById('weight').value = Math.round(result) * 100 / 100;

            const weightElement = document.getElementById('weightResult');
            weightElement.innerHTML = "<span style='font-weight: 600'>Vikten av det förvärmda godset: </span>" + Math.round(result) * 100 / 100 + " kg";

            const resultForWeight = document.getElementById('workpieceResult');
            resultForWeight.removeAttribute('hidden');

            workPieceCalc = result !== 0;

            return result;
        }

        function calculateTemp(result) {

            let startingTemp = document.getElementById('startingTemp').value;
            let targetTemp = document.getElementById('targetTemp').value;
            let calculateTemp = targetTemp - startingTemp;

            console.log("Delta T in C: " + calculateTemp);
            document.getElementById('targetTemphidden').value = targetTemp;
            document.getElementById('startingTemphidden').value = startingTemp;
            document.getElementById('deltaThidden').value = calculateTemp;

            const numOfNozzles = getNumberOfNozzles(result);
            let avgAcetyleneHeatTime = acetyleneHeatingTime(numOfNozzles, result, calculateTemp);
            let avgPropaneHeatTime = propaneHeatingTime(numOfNozzles, result, calculateTemp);

            const deltaTemperature = document.getElementById('deltaT');
            deltaTemperature.innerHTML = "<span style='font-weight: 600'>Delta T (°C): </span>" + calculateTemp + " °C";

            const resultForTemp = document.getElementById('deltaTemp');
            resultForTemp.removeAttribute('hidden');

            tempCalc = calculateTemp !== 0;
        }
        function getNumberOfNozzles(result) {
            let numberOfNozzles = 0;
            if (result >= 1 && result <= 1000) {
                numberOfNozzles = 16;
            } else if (result >= 1001 && result <= 2000) {
                numberOfNozzles = 33;
            }
            else if (result >= 2001 && result <= 3000) {
                numberOfNozzles = 49;
            } else if (result >= 3001 && result <= 4000) {
                numberOfNozzles = 66;
            } else if (result >= 4001 && result <= 5000) {
                numberOfNozzles = 82;
            } else if (result >= 5001 && result <= 6000) {
                numberOfNozzles = 99;
            } else if (result >= 6001 && result <= 7000) {
                numberOfNozzles = 115;
            } else if (result >= 7001 && result <= 8000) {
                numberOfNozzles = 132;
            } else if (result >= 8001 && result <= 9000) {
                numberOfNozzles = 148;
            }
            else if (result >= 9001 && result <= 10000) {
                numberOfNozzles = 165;
            } else {
                console.log("Incorrect number");
            }

            console.log("number of nozzles: " + numberOfNozzles);
            document.getElementById('numberOfNozzles').value = numberOfNozzles;

            return numberOfNozzles;

        }

        function acetyleneHeatingTime(numberOfNozzles, result, calculateTemp) {
            let gasConsumption = 0.15;
            let efficiency = 0.9;
            let caloricValue = 5.25;
            let specificHeatCapacity = 490;
            let powerPrimaryFlame = gasConsumption * efficiency * caloricValue;
            let totalPower = numberOfNozzles * powerPrimaryFlame;
            energyNeed = (specificHeatCapacity * result * calculateTemp) / 1000;
            let heatingTime = Math.round((energyNeed / totalPower / 60) * 100) / 100;
            console.log("Theoretical heating time in minutes(Acetylene): " + heatingTime);
            document.getElementById('heatingTime').value = heatingTime;
            const acetyleneMinutesForHeating = document.getElementById('acetyleneMinutes');
            acetyleneMinutesForHeating.innerHTML = "<span style='color: #00A0E1; display: inline-block; font-family: 'Linde Dax', Arial, sans-serif; font-weight: 600; margin-left: 2%;'></span>" + heatingTime + "min";
            finalAcetyleneHeatingTime = heatingTime;
            return heatingTime;
        }

        function propaneHeatingTime(numberOfNozzles, result, calculateTemp) {
            let caloricValue = 2.90;
            let gasConsumption = 0.15;
            let efficiency = 0.70;
            energyNeed = (490 * result * calculateTemp) / 1000;
            let powerPrimaryFlame = gasConsumption * caloricValue * efficiency;
            let totalPower = numberOfNozzles * powerPrimaryFlame;
            let propaneHeatTime = energyNeed / totalPower / 60;
            let roundedHeatTime = Math.round(propaneHeatTime * 100) / 100;
            console.log("Theoretical heating time in minutes (propane): " + roundedHeatTime);
            document.getElementById('roundedHeatTime').value = roundedHeatTime;
            const propaneMinutesForHeating = document.getElementById('propaneMinutes');
            propaneMinutesForHeating.innerHTML = "<span style='color: #00A0E1; display: inline-block; font-family: 'Linde Dax', Arial, sans-serif; font-weight: 600; margin-left: 2%;'></span>" + roundedHeatTime + "min";
            finalPropaneHeatingTime = roundedHeatTime;
            return roundedHeatTime;

        }

        function makeCalculationVisibile() {
            var e = document.getElementById("calculation");
            document.getElementById("calculation").style.display = 'block';
        }

        function openFirstBox() {
            const buttonIcon = document.getElementById('buttonForFirstTab');
            const Logistics = document.getElementById('firstBoxInfo');
            const logisticsLine = document.getElementById('lineForFirstBox');
            const listForFirst = document.getElementById('firstBoxList');

            if (!Logistics.hidden) {
                buttonIcon.src = "https://img03.en25.com/EloquaImages/clients/OYAGAAb/%7Bc92d11f3-7ddf-4cd0-9502-bf5442df70f3%7D_down_arrow.png";
                Logistics.hidden = true;
                logisticsLine.hidden = true;
                listForFirst.style.display = 'none';
            } else {
                Logistics.removeAttribute('hidden');
                logisticsLine.removeAttribute('hidden');
                buttonIcon.src = "https://img03.en25.com/EloquaImages/clients/OYAGAAb/%7Bc29e9557-b6d3-4b57-bd43-62667575b1cc%7D_up_arrow.png";
                listForFirst.style.display = 'block';
            }
        }

        function openSecondBox() {
            const buttonIconTwo = document.getElementById('buttonForSecondTab');
            const productivity = document.getElementById('secondBoxInfo');
            const productivityLine = document.getElementById('lineForSecondBox');
            const listForSecond = document.getElementById('secondBoxList');

            if (!productivity.hidden) {
                buttonIconTwo.src = "https://img03.en25.com/EloquaImages/clients/OYAGAAb/%7Bc92d11f3-7ddf-4cd0-9502-bf5442df70f3%7D_down_arrow.png";

                productivity.hidden = true;
                productivityLine.hidden = true;
                listForSecond.style.display = 'none';
            } else {
                productivity.removeAttribute('hidden');
                productivityLine.removeAttribute('hidden');
                buttonIconTwo.src = "https://img03.en25.com/EloquaImages/clients/OYAGAAb/%7Bc29e9557-b6d3-4b57-bd43-62667575b1cc%7D_up_arrow.png";
                listForSecond.style.display = 'block';

            }
        }

        function openThirdBox() {
            const buttonIconThree = document.getElementById('buttonForThirdTab');
            const environment = document.getElementById('ThirdBoxInfo');
            const environmentLine = document.getElementById('lineForThirdBox');

            if (!environment.hidden) {
                buttonIconThree.src = "https://img03.en25.com/EloquaImages/clients/OYAGAAb/%7Bc92d11f3-7ddf-4cd0-9502-bf5442df70f3%7D_down_arrow.png";
                environment.hidden = true;
                environmentLine.hidden = true;
            } else {
                environment.removeAttribute('hidden');
                environmentLine.removeAttribute('hidden');
                buttonIconThree.src = "https://img03.en25.com/EloquaImages/clients/OYAGAAb/%7Bc29e9557-b6d3-4b57-bd43-62667575b1cc%7D_up_arrow.png";
            }
        }

        function openFourthBox() {
            const buttonIconFour = document.getElementById('buttonForFourthTab');
            const invest = document.getElementById('FourthBoxInfo');
            const investLine = document.getElementById('lineForFourthBox');
            const listForFourth = document.getElementById('fourthBoxList');


            if (!invest.hidden) {
                buttonIconFour.src = "https://img03.en25.com/EloquaImages/clients/OYAGAAb/%7Bc92d11f3-7ddf-4cd0-9502-bf5442df70f3%7D_down_arrow.png";
                invest.hidden = true;
                investLine.hidden = true;
                listForFourth.style.display = 'none';

            } else {
                invest.removeAttribute('hidden');
                investLine.removeAttribute('hidden');
                buttonIconFour.src = "https://img03.en25.com/EloquaImages/clients/OYAGAAb/%7Bc29e9557-b6d3-4b57-bd43-62667575b1cc%7D_up_arrow.png";
                listForFourth.style.display = 'block';
            }
        }

        function makeSecondPageVisible() {
            if (!workPieceCalc || !tempCalc) {
                const fieldsInput = document.getElementById('fieldsComplete');
                fieldsInput.removeAttribute('hidden');

                return;
            }
     

            console.log("wronginput" + parseFloat(widthInput.innerText));


            const secondPage = document.getElementById('secondPageDiv');
            secondPage.removeAttribute('hidden');
            const firstPage = document.getElementById('firstPageBlock');
            firstPage.style.display = 'none';
            timeSaving();
            scrollToTop(300);


            var form_data = $('#valueTool').serialize(); 
            $.ajax({
                url: 'https://s1512530243.t.eloqua.com/e/f2?elqSiteID=1512530243&elqFormName=se_lindoflamm_valuetool',
                type: 'post',
                data: form_data
            }).done(function (response) { //
                console.log('elqFormData sent');
            });
        }

        function inputFieldErrors() {
            if (thicknessInput.innerText === '') {
                thicknessFiledError.style.display = 'block';
                return;
            }

            thicknessFiledError.style.display = 'none';
        }
        function inputFiledErrorsTwo() {

            if (lengthInput.innerText === '') {
                lengthFiledError.style.display = 'block';
                return;
            }

            lengthFiledError.style.display = 'none';
        }


        function startNewCalculation(secondPage, firstPage) {

            const newcalc = document.getElementById('firstPageBlock');
            const secondPageHide = document.getElementById('secondPageDiv');
            newcalc.style.display = 'block';
            secondPageHide.setAttribute('hidden', true);

        }

        function scrollToTop(duration) {
            if (document.scrollingElement.scrollTop === 0) return;

            const totalScrollDistance = document.scrollingElement.scrollTop;
            let scrollY = totalScrollDistance, oldTimestamp = null;

            function step(newTimestamp) {
                if (oldTimestamp !== null) {
                    scrollY -= totalScrollDistance * (newTimestamp - oldTimestamp) / duration;
                    if (scrollY <= 0) return document.scrollingElement.scrollTop = 0;
                    document.scrollingElement.scrollTop = scrollY;
                }
                oldTimestamp = newTimestamp;
                window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);
        }
