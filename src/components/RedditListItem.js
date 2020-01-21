import React from 'react';

const RedditListItem = ({ author, downs, link, numcomment, sub, thumbnail, title, ups, utcdate }) => (
    <div className="row item">
        <div className="col-md-12">
            <div className="row">
                <div className="col-md-3 label">
                    <p className="sub">{sub}</p>
                    <p>
                        <span>{author}<br />
                            {utcdate}</span>
                    </p>
                </div>
                <div className="col-md-9 title">
                    <a href={link}>{title}</a>
                </div>
            </div>
            <div className="row">
                <div className="col-md-3 thumbnail">
                    <img src={thumbnail} alt={title} />
                </div>
                <div className="col-md-9 updown">
                    <p>
                        <span>Ups: {ups} / Downs: {downs}<br />
                            Comments: {numcomment}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
);
  
export default RedditListItem;
