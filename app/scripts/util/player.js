/**
 * Created by whc on 16/5/29.
 */

var YKUPlayer = {
  play(vid) {
  new YKU.Player('youkuplayer',{
    client_id: '28bb1d0898ca1028',
    vid: vid,
    newPlayer: true
  })
  }
}

module.exports = YKUPlayer;
