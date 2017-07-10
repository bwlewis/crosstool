# Crosstool: A Generic Control Widget for Crosstalk

Create widgets that send control information, for example from sliders or other
HTML elements ("transmitters"). Or make widgets that receive information from
crosstalk apps ("receivers"). Transmitters and receivers use one-sided
communication unlike most other crosstalk widgets.  Or transceive and
optionally transcode key information from one crosstalk group to another
("transceiver").

See https://rstudio.github.io/crosstalk/ for details on crosstalk.

This prototype defines three ridiculously barebones generic widget classes:
transmitter, receiver, and transceiver. Unlike typical crosstalk widgets, these
widgets are generally _uni-directional_, either transmitting or receiving data,
respectively, on a crosstalk _selection_ interface.  "Transceiver" widgets use
two one-sided communication channels, one for each crosstalk group (receiving
on one group and transmitting to the other).

The widget is intended as low-level prototype for generic user-interface
control elements, similar to the control widgets available in shiny. They can
be used with other crosstalk-enabled widgets that can benefit from external
user-interface controls.

This is a crude, wacky prototype!

# Examples

## Using 'receiver' to debug crosstalk key state

Eavesdrop on widget chatter.

```{r}
library(crosstalk)
library(crosstool)
library(htmltools)
library(d3scatter) # devtools::install_github("jcheng5/d3scatter")

x = iris[sample(150, 50), ]
rownames(x) = NULL
x$key = state.name
sd = SharedData$new(x, key=~key)
d1 = d3scatter(sd, x=~Petal.Length, y=~Petal.Width, color=~Species, width="100%")
d2 = d3scatter(sd, x=~Sepal.Length, y=~Sepal.Width, color=~Species, width="100%")

rx = crosstool(sd, "receiver",  html="<span style='font-size:14pt;'/>", value="innerText", width="100%")
bscols(d1, d2, rx, widths=c(4,4,4))
```

## Using 'transmitter' to set initial selection state for a crosstalk group

This is one way to address the discussion in https://github.com/rstudio/crosstalk/issues/16.

```{r}
library(crosstalk)
library(crosstool)
library(htmltools)
library(d3scatter)

x = iris[sample(150, 50), ]
rownames(x) = NULL
x$key = state.name
sd = SharedData$new(x, key=~key)
d1 = d3scatter(sd, x=~Petal.Length, y=~Petal.Width, color=~Species, width="100%")
d2 = d3scatter(sd, x=~Sepal.Length, y=~Sepal.Width, color=~Species, width="100%")

rx = crosstool(sd, "receiver",  html="<span style='font-size:14pt;'/>", value="innerText", width="100%")

# Make an initial random selection and use the 'init' option
i = sample(state.name, 10)
tx = crosstool(sd, "transmitter", init=i)

bscols(d1, d2, rx, tx, widths=c(4,4,4,0))
```


