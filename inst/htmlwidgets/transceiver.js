HTMLWidgets.widget({
  name: 'transceiver',       // see also transmitter, receiver
  type: 'output',

  factory: function(el, width, height) {
    var antenna = {channel_1: null, channel_2: null};
    return {
      renderValue: function(x) {
        if(x.crosstalk_group) { 
          if(x.channel == "filter") {
            antenna.channel_1 = new crosstalk.FilterHandle();
            antenna.channel_2 = new crosstalk.FilterHandle();
          }
          else {
            antenna.channel_1 = new crosstalk.SelectionHandle();
            antenna.channel_2 = new crosstalk.SelectionHandle();
          }
          antenna.channel_1.setGroup(x.crosstalk_group);
          antenna.channel_2.setGroup(x.crosstalk_group2);
        } else return;
        el.innerHTML = x.innerHTML;
        var cf = function(e) {
          if(e.sender === antenna.channel_1 || e.sender === antenna.channel_2) return;
          if(x.alldone) return;
          if(x.reset && e.sender)
          {
            antenna.channel_2.set(x.reset);
            x.alldone = true;
            return;
          }
          var val;
          if(Array.isArray(e.value)) {
            // the usual crosstalk selection array values
            if(x.lookup) {
              val = e.value.map(function(i) {return x.lookup[x.crosstalk_key.indexOf(i)];});
            } else val = e.value;
            if(! Array.isArray(val)) val = [val];
              if(Array.isArray(val[0])) val = [].concat.apply([], val); // flatten
          } else val = e.value;
          if(el.children && el.children.length > 0) el.children[0][x.value] = val;
         antenna.channel_2.set(val);
        };
        antenna.channel_1.on("change", cf);
        if(el.children && el.children.length > 0) {
          el.children[0].addEventListener("change", function() {
            var val = el.children[0][x.value];
            if(!Array.isArray(val)) val = [val];
            if(Array.isArray(val[0])) val = [].concat.apply([], val); // flatten
            antenna.channel_2.set(val); // send HTML element values
          });
        }
        if(x.init) {
          var val;
          if(Array.isArray(x.init)) {
            if(x.lookup) val = x.init.map(function(i) {return x.lookup[x.crosstalk_key.indexOf(i)];});
            else val = x.init;
          } else {
            if(x.lookup) val = [x.lookup[x.crosstalk_key.indexOf(x.init)]];
            else val = [x.init];
          }
          antenna.channel_2.set(val);
          cf({sender: null, value: val});
        }
      },
      resize: function(width, height) { }
    };
  }
});
