import React from 'react'
import confluence from 'images/confluence.png'
import docs from 'images/docs.png'
import dropbox from 'images/dropbox.png'
import excel from 'images/excel.png'
import onedrive from 'images/onedrive.png'
import pdf from 'images/pdf.png'
import github from 'images/github.png'
import Sharepoint from 'images/sharepoint.svg'
import sheets from 'images/sheets.png'
import slides from 'images/slides.png'
import teams from 'images/teams.png'
import sql_server from 'images/sql server.png'
import word from 'images/word.png'
import faq from 'images/faq.png'
import powerpoint from 'images/powerpoint.png'
import outlook from 'images/outlook.png'
import image from 'images/image.png'
import ECAS from 'images/ecas.svg'
import SCAD from 'images/scad.svg'
import fileshare from 'images/file_share.svg'
import Movies from 'images/clapperboard.png'

export type SourceIconType = {
  className?: string
  icon:
    | 'confluence'
    | 'docs'
    | 'dropbox'
    | 'excel'
    | 'onedrive'
    | 'pdf'
    | 'Sharepoint'
    | 'sheets'
    | 'slides'
    | 'teams'
    | 'sql_server'
    | 'word'
    | 'github'
    | 'faq'
    | 'powerpoint'
    | 'outlook'
    | 'image'
    | string
}
export const SourceIcon: React.FC<SourceIconType> = ({ className, icon }) => {
  const iconNameToImageMap = {
    confluence,
    docs,
    dropbox,
    excel,
    onedrive,
    pdf,
    Sharepoint,
    sheets,
    slides,
    teams,
    sql_server,
    word,
    github,
    faq,
    powerpoint,
    outlook,
    image,
    'Movies Data': Movies
  }
  return (iconNameToImageMap[icon]?
    <span className={className}>
      <img className="w-full h-full" src={iconNameToImageMap[icon]} alt={icon} />
    </span>: null   
  )
}
