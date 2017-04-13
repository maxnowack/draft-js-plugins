import React, { Component } from 'react';
import ScrollArea from 'react-scrollbar';
import shortid from 'shortid';
import Group from './Group';

export default class Groups extends Component {
  componentDidMount() {
    this.calculateBounds();
  }

  shouldComponentUpdate() {
    return false;
  }

  onScroll = (value) => {
    const { topPosition } = value;

    if (topPosition) {
      const { groups, onGroupScroll } = this.props;
      let activeGroup = 0;
      groups.forEach((group, index) => {
        if (topPosition >= group.top) {
          activeGroup = index;
        }
      });
      onGroupScroll(activeGroup);
    }
  }

  scrollToGroup = (groupIndex) => {
    const { groups } = this.props;

    this.scroll.scrollYTo(groups[groupIndex].topList);
  }

  calculateBounds = () => {
    const { groups } = this.props;
    const scrollTop = this.scroll.content.getBoundingClientRect().top;

    groups.forEach((group) => {
      const containerTop = group.instance.container.getBoundingClientRect().top;
      const listTop = group.instance.list.getBoundingClientRect().top;
      group.top = containerTop - scrollTop; // eslint-disable-line no-param-reassign
      group.topList = listTop - scrollTop; // eslint-disable-line no-param-reassign
    });
  }

  render() {
    const {
      theme = {},
      groups = [],
      emojis = {},
      imagePath,
      imageType,
      cacheBustParam,
      onEmojiSelect,
    } = this.props;

    const scrollbarStyle = {
      margin: 0,
      width: '.3em',
      borderRadius: '.15em',
    };

    return (
      <ScrollArea
        className={theme.emojiSelectGroups}
        verticalContainerStyle={{
          ...scrollbarStyle,
          background: '#e0e0e0',
        }}
        verticalScrollbarStyle={scrollbarStyle}
        stopScrollPropagation
        onScroll={this.onScroll}
        ref={(element) => { this.scroll = element; }}
      >
        {groups.map((group) => (
          <Group
            key={shortid.generate()}
            theme={theme}
            group={group}
            emojis={emojis}
            imagePath={imagePath}
            imageType={imageType}
            cacheBustParam={cacheBustParam}
            onEmojiSelect={onEmojiSelect}
            ref={(node) => {
              group.instance = node; // eslint-disable-line no-param-reassign
            }}
          />
        ))}
      </ScrollArea>
    );
  }
}
