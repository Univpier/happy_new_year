const cvs = document.querySelector('.canvas')
const ctx = cvs.getContext('2d')
let stop = false
const imgPath = "static/images/"
const imgs = [
    'main.png',
    'foods.png',
    'ground.png',
    'up.png',
    'right.png',
    'left.png',
    'down.png'
]
let game
const ground = new Image()
ground.src = imgPath + 'ground.png'
const food = new Image()
food.src = imgPath + 'foods.png'
const michkinU = new Image()
michkinU.src = imgPath + 'up.png'
const michkinR = new Image()
michkinR.src = imgPath + 'right.png'
const michkinL = new Image()
michkinL.src = imgPath + 'left.png'
const michkinD = new Image()
michkinD.src = imgPath + 'down.png'
const box = 32
let score = 0
let foodCoordination = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
}
let snake = [{
    x: 9 * box,
    y: 10 * box
}]
let isLoaded = 0
let dir = ''
$('.arr_up').on('click', () => { dir = "up" })
$('.arr_down').on('click', () => { dir = "down" })
$('.arr_left').on('click', () => { dir = "left" })

$('.arr_right').on('click', () => { dir = "right" })
$('.restart').on('click', () => location.reload())
const loadImages = (images) => {
    return new Promise(resolve => {
        images.forEach(element => {
            let img = new Image()
            img.src = imgPath + element
            img.onload = () => {
                isLoaded += 1;
                if (isLoaded === images.length) {
                    resolve(isLoaded)
                }
            }
        });
    })

}
const direction = (e) => {
    if (e.keyCode == 37 && dir != 'right') dir = 'left'
    if (e.keyCode == 38 && dir != 'down') dir = 'up'
    if (e.keyCode == 39 && dir != 'left') dir = 'right'
    if (e.keyCode == 40 && dir != 'up') dir = 'down'

}

function eatTail(head, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (head.x == arr[i].x && head.y == arr[i].y) {
            clearInterval(game)
            $('.game_status').text(`Попробуй поступить ещё раз ${score}`)
            $('.restart').addClass('show')
        }

    }
}
const drawCanvas = () => {
    console.log(dir)
    ctx.drawImage(ground, 0, 0)
    ctx.drawImage(food, foodCoordination.x, foodCoordination.y)
    for (let i = 0; i < snake.length; i++) {

        if (i == 0) {
            if (dir == "left" || dir == '') ctx.drawImage(michkinL, snake[i].x, snake[i].y)

            if (dir == "right") ctx.drawImage(michkinR, snake[i].x, snake[i].y)
            if (dir == "up") ctx.drawImage(michkinU, snake[i].x, snake[i].y)
            if (dir == "down") ctx.drawImage(michkinD, snake[i].x, snake[i].y)


        } else {
            ctx.fillStyle = 'red'
            ctx.fillRect(snake[i].x + 8, snake[i].y + 8, box / 2, box / 2)
        }

    }
    ctx.fillStyle = 'white'
    ctx.font = '50px Arial'
    ctx.fillText(score, box * 12.5, box * 1.75)

    let snakeHeadX = snake[0].x
    let snakeHeadY = snake[0].y
    if (snakeHeadX < box || snakeHeadX > box * 17 || snakeHeadY < 3 * box || snakeHeadY > box * 17) {
        clearInterval(game)
        $('.game_status').text(`Насосано ${score}`)
        $('.restart').addClass('show')

    }
    if (snakeHeadX == foodCoordination.x && snakeHeadY == foodCoordination.y) {
        score++
        foodCoordination = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        }
    } else(
        snake.pop()
    )

    if (dir == "left") snakeHeadX -= box

    if (dir == "right") snakeHeadX += box
    if (dir == "up") snakeHeadY -= box
    if (dir == "down") snakeHeadY += box
    let newHead = {
        x: snakeHeadX,
        y: snakeHeadY
    }
    eatTail(newHead, snake)
    snake.unshift(newHead)

}
document.addEventListener('keydown', e => { direction(e) })
loadImages(imgs).then(res => {
    game = setInterval(drawCanvas, 180)

})
