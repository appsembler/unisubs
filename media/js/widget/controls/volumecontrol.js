// Amara, universalsubtitles.org
//
// Copyright (C) 2012 Participatory Culture Foundation
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see
// http://www.gnu.org/licenses/agpl-3.0.html.

goog.provide('unisubs.controls.VolumeControl');
/**
* @constructor
* @extends goog.ui.Component
*/
unisubs.controls.VolumeControl = function(videoPlayer) {
    goog.ui.Component.call(this);
    this.videoPlayer_ = videoPlayer;
    this.isMouseOver_ = false;
    this.volumeControlExtended_ = false;
};
goog.inherits(unisubs.controls.VolumeControl, goog.ui.Component);

unisubs.controls.VolumeControl.prototype.createDom = function() {
    var $d = goog.bind(this.getDomHelper().createDom, this.getDomHelper());
    var el = $d('span', 'unisubs-volume');
    this.setElementInternal(el);
    this.volumeButton_ = $d('span');
    this.getElement().appendChild(this.volumeButton_);
    this.volumeSliderContainer_ = new goog.ui.Component();
    this.volumeSlider_ = new unisubs.controls.VolumeSlider();
    this.volumeSliderContainer_.addChild(this.volumeSlider_, true);
    this.addChild(this.volumeSliderContainer_, true);
    this.volumeSliderContainer_.getElement().className =
        'unisubs-volume-container';
};

unisubs.controls.VolumeControl.prototype.enterDocument = function() {
    unisubs.controls.VolumeControl.superClass_.enterDocument.call(this);
    this.getHandler().
        listen(
            this.volumeSlider_, goog.ui.Component.EventType.CHANGE,
            this.volumeSliderUpdate_).
        listen(
            this.volumeSlider_, unisubs.SliderBase.EventType.STOP,
            this.sliderStopInteracting_).
        listen(this.getElement(), 'mouseout', this.onMouseOut_).
        listen(this.getElement(), 'mouseover', this.onMouseOver_);
};

unisubs.controls.VolumeControl.prototype.onMouseOut_ = function(event) {
    if (this.isMouseOver_ &&
        event.relatedTarget &&
        !goog.dom.contains(this.getElement(), event.relatedTarget)) {
        this.isMouseOver_ = false;
        if (!this.volumeSlider_.isCurrentlyInteracting())
            this.retractVolumeSlider_();
    }
};

unisubs.controls.VolumeControl.prototype.sliderStopInteracting_ =
    function(event)
{
    if (!this.isMouseOver_)
        this.retractVolumeSlider_();
};

unisubs.controls.VolumeControl.prototype.onMouseOver_ = function(event) {
    this.isMouseOver_ = true;
    this.extendVolumeSlider_();
};

unisubs.controls.VolumeControl.prototype.volumeSliderUpdate_ = function(e) {
    this.videoPlayer_.setVolume(this.volumeSlider_.getValue() / 100);
};

unisubs.controls.VolumeControl.prototype.extendVolumeSlider_ = function(e) {
    if (this.volumeControlExtended_)
        return;
    this.volumeControlExtended_ = true;
    this.volumeSlider_.setValue(this.videoPlayer_.getVolume() * 100);
    var animation = new goog.fx.dom.ResizeHeight(
        this.volumeSliderContainer_.getElement(),
        0, 100, 100);
    animation.play(false);
};

unisubs.controls.VolumeControl.prototype.retractVolumeSlider_ = function() {
    if (!this.volumeControlExtended_)
        return;
    this.volumeControlExtended_ = false;
    var animation = new goog.fx.dom.ResizeHeight(
        this.volumeSliderContainer_.getElement(),
        100, 0, 100);
    animation.play(false);
};
