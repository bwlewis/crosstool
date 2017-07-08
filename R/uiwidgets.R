#' Create a generic HTML crosstalk user interface endpoint.
#'
#' Use \code{widget} to define generic HTML elements with limited
#' crosstalk functionality. These elements can be used to control
#' crosstalk-enabled applications.
#' @param crosstalk A crosstalk SharedData object. Currently only used for the crosstalk group.
#' @param class The transmitter and receiever widgets use limited uni-directional crosstalk
#'        communication. Transceiver widgets are more like normal crosstalk widgets.
#' @param html A valid HTML object string.
#' @param value The HTML object's I/O field name, for instance 'value' for some 'input' HTML elements.
#' @param ... Additional arguments passed directly to the JavaScript code.
#' @return An HTML widget object.
#' @note Notable Features
#' \enumerate{
#' \item{Mostly uni-directional messaging to other widgets}
#' \item{Defaults to transmitting raw html object values (not indexed values from a shared data frame}
#' \item{Mostly uses the shared crosstalk data frame for its group key}
#' }
#' @section Receiver-specific notes:
#' Specify the optional \code{data=<vector>} argument to use indexed values in the
#' specified \code{data} vector indexed by the crosstalk key.
#'
#' @section Transmitter-specific notes:
#'
#' @section Transceiver-specific notes:
#'
#' @export
widget <- function(crosstalk, class=c("transmitter", "receiver", "transceiver"),
                     html, value="value", ..., width=NULL, height=NULL)
{
  x <- c(innerHTML=html, value=value, list(...))
  x$crosstalk_key <- NULL
  x$crosstalk_group <- NULL
  if (is.SharedData(crosstalk))
  {
    x$crosstalk_key <- crosstalk$key()
    x$crosstalk_group <- crosstalk$groupName()
  }

  htmlwidgets::createWidget(
          name = class,
          x = x,
          width = width,
          height = height,
          htmlwidgets::sizingPolicy(padding = 0, browser.fill = TRUE),
          dependencies = crosstalk::crosstalkLibs(),
          package = "uiwidgets")
}
