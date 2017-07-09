#' Create a generic HTML crosstalk user interface endpoint.
#'
#' Use \code{widget} to define generic HTML elements with limited
#' crosstalk functionality. These elements can be used to control
#' crosstalk-enabled applications.
#' @param data A crosstalk SharedData object. Currently only used for the crosstalk group.
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
#'
#' @section Receiver-specific notes:
#' Specify the optional \code{lookup=<vector>} argument to use indexed values in the
#' specified \code{lookup} vector indexed by the crosstalk key.
#'
#' @section Transmitter-specific notes:
#' Only raw HTML object values specified by the \code{value} argument are transmitted.
#'
#' @section Transceiver-specific notes:
#' Specify the optional \code{relay=<Shared data object>} to relay the message to another
#' Crosstalk group. The transceiver acts like a recevier, but re-transmits its (optionally
#' looked-up values) to a 2nd crosstalk group. If \code{relay} is not specified, then
#' the 2nd group defaults to the crosstalk group in the \code{data} argument. This
#' widget ignores the \code{value} and \code{html} arguments--it does not normally
#' have a corresponding visual component.
#'
#' @export
widget <- function(data, class=c("transmitter", "receiver", "transceiver"),
                     html="", value="value", ..., width=NULL, height=NULL)
{
  x <- c(innerHTML=html, value=value, list(...))
  if (is.SharedData(data))
  {
    if(is.null(x$crosstalk_key)) x$crosstalk_key <- data$key()  # allow key override
    x$crosstalk_group <- data$groupName()
    x$crosstalk_group2 <- data$groupName()
  }
  if("relay" %in% names(x))
  {
    x$crosstalk_group2 <- x$relay$groupName()
    x$relay <- NULL
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
