--
-- Database: `ideahub`
--
CREATE DATABASE `ideahub` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `ideahub`;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `idea_id` int(10) NOT NULL,
  `comment` text NOT NULL,
  `user` varchar(100) NOT NULL,
  `comment_date` int(20) NOT NULL,
  `helpful` int(11) NOT NULL,
  `unhelpful` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Table structure for table `commentvote`
--

CREATE TABLE IF NOT EXISTS `commentvote` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `voter` int(10) NOT NULL,
  `comment_id` int(10) NOT NULL,
  `helpful` int(10) NOT NULL,
  `unhelpful` int(10) NOT NULL,
  `vote_time` int(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Table structure for table `ideacats`
--

CREATE TABLE IF NOT EXISTS `ideacats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `card` varchar(200) NOT NULL,
  `subscribers` int(11) NOT NULL,
  `posts` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Table structure for table `ideas`
--

CREATE TABLE IF NOT EXISTS `ideas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `details` text NOT NULL,
  `title` varchar(200) NOT NULL,
  `date_posted` int(11) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `privacy` int(11) NOT NULL,
  `cards` varchar(200) NOT NULL,
  `up_date` int(20) NOT NULL,
  `vote_ups` int(11) NOT NULL DEFAULT '0',
  `vote_downs` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Table structure for table `ideavote`
--

CREATE TABLE IF NOT EXISTS `ideavote` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idea_id` int(10) NOT NULL,
  `vote_up` int(10) NOT NULL,
  `vote_down` int(10) NOT NULL,
  `voter` varchar(100) NOT NULL,
  `vote_time` int(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Table structure for table `notification`
--

CREATE TABLE IF NOT EXISTS `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `seen` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `u_time` int(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `surname` varchar(100) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `avatar` varchar(200) NOT NULL,
  `session_id` varchar(100) NOT NULL,
  `cards` varchar(200) NOT NULL,
  `gender` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
