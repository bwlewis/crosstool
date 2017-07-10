HTMLWidgets.widget({
  name: 'receiver',       // see also transmitter
  type: 'output',

  factory: function(el, width, height) {
    var antenna = {channel: null};
    return {
      renderValue: function(x) {
        if(x.crosstalk_group) { 
          if(x.channel == "filter") antenna.channel = new crosstalk.FilterHandle();
          else antenna.channel = new crosstalk.SelectionHandle();
          antenna.channel.setGroup(x.crosstalk_group);
        }
        el.innerHTML = x.innerHTML;
        antenna.channel.on("change", function(e) {
          if(e.sender === antenna.channel) return;
          var val;
          if(Array.isArray(e.value) && x.lookup) {
              val = e.value.map(function(i) {return x.lookup[x.crosstalk_key.indexOf(i)];});
          } else val = e.value;
          if(Array.isArray(val) && val.length > 0 && Array.isArray(val[0])) val = [].concat.apply([], val);
          if(el.children && el.children.length > 0) el.children[0][x.value] = val;
        });
      },
      resize: function(width, height) { }
    };
  }
});
