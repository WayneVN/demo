/**
 * Created by whc on 16/5/29.
 */

var YKUPlayer = {
    play(vid) {
        if (window.YKU) {
            new YKU.Player('youkuplayer', {
                client_id: '28bb1d0898ca1028',
                vid: vid,
                newPlayer: true
            })
        }
        else {
            setTimeout(function () {
                YKUPlayer.play(vid);
            }, 100);
        }
    }
}

module.exports = YKUPlayer;
