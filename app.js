document.addEventListener("DOMContentLoaded",() =>{
    const grid = document.querySelector('.box-grid');
    const jumper = document.createElement('img');

    let startPoint = 150;
    let jumperLeftSpace = 50;
    let jumperBottomSpace = startPoint;
    let isGameOver = false;
    let platformCount = 7;
    let platforms = [];
    let upTimerId;
    let downTimerId;
    let leftTimerId;
    let rightTimerId;
    let isJumping = true;
    let score = 0;

    function createJumper(){
        grid.appendChild(jumper);
        jumper.src = "assets/doodle.png";
        jumper.classList.add('jumper');
        jumperLeftSpace = platforms[0].left;
        jumper.style.left = jumperLeftSpace + 'px';
        jumper.style.bottom = jumperBottomSpace + 'px';

    }
    

    function createPlatforms(){
        for (let i = 0; i<platformCount; i++){
            let platformGap = 600 / platformCount;
            let newPlatformBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatformBottom);

            platforms.push(newPlatform);
        }
    }

    function movePlatforms(){
        if(jumperBottomSpace>0){
            platforms.forEach(platform =>{
                platform.bottom -= 4;
                let visual = platform.visual;
                visual.style.bottom = platform.bottom + 'px';

                if(platform.bottom < 10){
                    let firstPlatform = platforms[0].visual;
                    firstPlatform.classList.remove('platform');
                    score += 1;
                    platforms.shift();
                    let newPlatform = new Platform(600);
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function jump(){
        clearInterval(downTimerId);
        isJumping = true;
        upTimerId = setInterval(function (){
            jumperBottomSpace += 10;
            jumper.style.bottom = jumperBottomSpace + 'px';
            if(jumperBottomSpace > startPoint + 150){
                fall()
            }
        }, 30)

    }

    function fall(){
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function(){
            jumperBottomSpace -= 10;
            jumper.style.bottom = jumperBottomSpace + 'px';
            if(jumperBottomSpace <= 0){
                gameOver();
            }
            platforms.forEach(platform =>{
                if(
                    (jumperBottomSpace >= platform.bottom) &&
                    (jumperBottomSpace <= platform.bottom + 15) &&
                    ((jumperLeftSpace + 65) >= platform.left) &&
                    (jumperLeftSpace <= (platform.left + 65)) &&
                    (isJumping == false)
                ){
                    startPoint = jumperBottomSpace;
                    jump();

                }
            })

        }, 15)
    }

    function control(e){
        if(e.key == 'ArrowLeft'){
            //move left
            moveLeft();
        }else if(e.key == 'ArrowRight'){
            moveRight();
        }else if (e.key == 'ArrowUp'){
            moveStraight();
        }
    }

    function moveLeft(){
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
        leftTimerId = setInterval(function(){
            if(jumperLeftSpace >= 0){
                jumperLeftSpace -= 5;
                jumper.style.left = jumperLeftSpace + 'px';
            }else {
                jumperLeftSpace = 340;
                jumper.style.left = jumperLeftSpace + 'px';
            }

        },15)
    }
    function moveRight(){
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        rightTimerId = setInterval(function(){
            if(jumperLeftSpace <= 340){
                jumperLeftSpace += 5;
                jumper.style.left = jumperLeftSpace + 'px'
            }else{
                jumperLeftSpace = 0;
                jumper.style.left = jumperLeftSpace + 'px';
            }
        }, 15)
    }

    function moveStraight(){
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
        jumper.style.left = jumperLeftSpace;
    }

    function gameOver(){
        console.log('game over')
        //isGameOver = true;
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML += "Score: \n";
        grid.innerHTML += score;
        var image = document.createElement('img');
        image.src = "assets/doodle.png";
        image.classList.add("endScreen");
        grid.appendChild(image);
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

    function start(){
        if(isGameOver == false){
            while(grid.firstChild){
                grid.removeChild(grid.firstChild);
            }
            createPlatforms();
            createJumper();
            setInterval(movePlatforms, 30);
            jump();
            document.addEventListener('keydown', control);
        }
        
    }
    class Platform{
        constructor(newPlatformBottom){
            this.bottom = newPlatformBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div');

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }
    function play(){
        let play = document.createElement('div');
        let button = document.createElement('button');
        play.classList.add('play_button');
        button.classList.add('button');
        button.innerHTML = "Play";
        button.onclick = "Playing";
        play.appendChild(button);
        button.addEventListener('click', start);
        grid.appendChild(play);
    }

    play()

})