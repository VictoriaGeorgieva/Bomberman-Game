/**
 * Created by Victoria on 1/31/2016.
 */
// Global vars
canvas = null;
ctx = null;

var MainGame = null;
var MainMenu = null;
var LoggedUser = null;
var UserTimeline = null;
var UserStatistics = null;

var menuOptionsClicked = function(numItem){
    switch(numItem){
        case 0:
            StartGame('singleplayer');
            break;
        case 1:
            StartGame('multiplayer');
            break;
    }
};

function StartGame(type)
{
    GameLoopManager.stop();
    MainMenu = null;
    MainGame = new Game(type);
    // Async load audio and images, start gameplay when loaded
    MultiStepLoader( [
        [ "audio", function(cb, i) {
            AudioManager.load({
                'bomb_timer'       : 'audio/bomb_timing_cutted',
                'bomb_exploding'   : 'audio/explosion',
                'bonus_get'        : 'audio/bonus',
                'monster_killed'   : 'audio/explosion',
                'player_killed'    : 'audio/explosion',
                'game_theme'       : 'audio/game_theme',
                'game_over'        : 'audio/game_over',
                'game_win'         : 'audio/game_win'
            }, function() {
                cb(i); } ) } ],
        [ "images", function(cb, i) {
            LoadImages(MainGame.images, {
                background           : "images/background.png",
                rock                 : "images/rock.png",
                brick                : "images/brick.png",
                brick_faded          : "images/brick_faded.png",
                player_right         : "images/player_right.png",
                player_front         : "images/player_front.png",
                player_left          : "images/player_left.png",
                player_back          : "images/player_back.png",
                enemy_1              : "images/enemy_1.png",
                bomb                 : "images/bomb_bigger.png",
                fireball             : "images/fireball.png",
                bonus_fire           : "images/bonus_fire.png",
                bonus_bomb           : "images/bonus_bomb.png",
                bonus_time           : "images/bonus_time.png",
                bonus_enemy_freeze   : "images/bonus_enemy_freeze.png",
                bonus_enemy_slowdown : "images/bonus_enemy_slowdown.png"
            }, function() {
                cb(i); } ) } ],
    ], function() {
        // All done, go!
        InputManager.reset();
        GameLoopManager.run(function(elapsed) { MainGame.Tick(elapsed); });
    } );
}

function StartMainMenu()
{
    $('#timer').css('display','none');
    GameLoopManager.stop();
    MainGame = null;
    // Async load audio and start menu when loaded
    MultiStepLoader( [
        [ "audio", function(cb, i) {
            AudioManager.load({
                'blip'   : 'audio/blip',
                'select' : 'audio/select'
            }, function() {
                cb(i); } ) } ],
    ], function() {
        // All done, go!
        InputManager.reset();
        MainMenu = new Menu("Bomberman",
            [ "New Game", "Multiplayer"],
            "",
            70, 50, 400,
            menuOptionsClicked,
            null);
        GameLoopManager.run(function(elapsed) { MainMenu.Tick(elapsed); });
    } );
}

function ClearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var lingrad = ctx.createLinearGradient(0,0,0,canvas.height);
    lingrad.addColorStop(0, '#000');
    lingrad.addColorStop(1, '#023');
    ctx.fillStyle = lingrad;
    ctx.fillRect(0,0,canvas.width, canvas.height);
}

$(document).ready(function () {
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");

    var lingrad = ctx.createLinearGradient(0,0,0,canvas.height);
    lingrad.addColorStop(0, '#000');
    lingrad.addColorStop(1, '#023');
    ctx.fillStyle = lingrad;
    ctx.fillRect(0,0,canvas.width, canvas.height);

    InputManager.connect(document, canvas);
    StartMainMenu();
});