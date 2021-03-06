# coding:utf-8
from bottle import request, route, get, post, hook, response, static_file, template, redirect, run 
import mysql.connector
import datetime
import os.path
import string 
import random
import time
import json
import os


#status
INS = 'INS'
ALL = 'ALL'
KEY = 'key'
DEL = 'DEL'

#ファイルパス
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, 'static')

#CSS
@route('/static/css/<filename:path>')
def send_static_css(filename):
    return static_file(filename, root=f'{STATIC_DIR}/css')

#JS
@route('/static/js/<filename:path>')
def send_static_js(filename):
    return static_file(filename, root=f'{STATIC_DIR}/js')

#img
@route('/static/img/<filename:path>')
def send_static_img(filename):
    return static_file(filename, root=f'{STATIC_DIR}/img')

@get("/admin")
def indexGet():
    return template('admin')

@post("/admin")
def indexPost():
    return template('admin')

@post('/regBook')
def regBook():
    #値取得
    data = request.json
    qerytype = INS

    admindbconn(qerytype, data)

    book = {
        'return': True
    }
    jsonBook = makeJson(book)

    return jsonBook

@post('/delBook')
def delBook():
    #値取得
    data = request.json
    qerytype = DEL

    admindbconn(qerytype, data)

    book = {
        'return': True
    }
    jsonBook = makeJson(book)

    return jsonBook

@post('/allBooks')
def allBooks():
    #値取得
    data = request.json
    qerytype = ALL

    book = admindbconn(qerytype, data)

    #ID NULLチェック
    if isBookCheck(book):
        print('checkedbook:')
        #json作成
        jsonBook = makeJson(book)
        print(type(jsonBook))
        return jsonBook
    else:
        return None

i = 0
def isBookCheck(book):
    if book == None:
        print('チェックNG')
        global i
        i += 1
        print('i')
        print(i)
        if i < 5:
            return None 
        else:
            return True
    else:
        print('チェックOK')
        return True

def makeJson(book):
    jsonBook = jsonDumps(book)
    return jsonBook
    
def jsonDumps(book):
    book = json.dumps(book)
    return isTypeCheck(book)

def isTypeCheck(jsonBook):
    if type(jsonBook) is str:
        return jsonBook
    else:
        jsonDumps(jsonBook)
    
def admindbconn(qerytype, data):
    print("q")
    print(qerytype)
    print(data)

    f = open('./conf/prop.json', 'r')
    info = json.load(f)
    f.close()
   
    #DB設定
    
    conn = mysql.connector.connect(
            host = info['host'],
            port = info['port'],
            user = info['user'],
            password = info['password'],
            database = info['database'],
    )
    
    cur = conn.cursor(dictionary=True)   

    print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

    try:    
        #接続クエリ
        if qerytype == INS:
            print("ccccccccccccccccccccccccccccccccccccccccccccccccccc")
            area = data['area']
            print(area)
            title = data['title']
            print(title)
            #url = data['url']
            author = data['author']
            publisher = data['publisher']
            
            now = datetime.datetime.now()
            create_dt = "{0:%Y-%m-%d %H:%M:%S}".format(now)
            update_dt = "{0:%Y-%m-%d %H:%M:%S}".format(now)

            # sql = "INSERT INTO bookshelf.books_info(category_id,area,title,url,img_id,author,publisher,rental_status,rental_user_name,rental_start_dt,rental_end_plan_dt,del_flg,create_dt,update_dt) VALUES (null,%s,%s,%s,null,%s,%s,0,null,null,null,0,%s,%s)"
            sql = "INSERT INTO bookshelf.books_info(category_id,area,title,url,img_id,author,publisher,rental_status,rental_user_name,rental_start_dt,rental_end_plan_dt,del_flg,create_dt,update_dt) VALUES (null,'"+area+"','"+title+"',null,null,'"+author+"','"+publisher+"',0,null,null,null,0,'"+create_dt+"','"+update_dt+"')"
            print(sql)       
        elif qerytype == KEY:
            sql = "SELECT area,title,rental_status,CAST(rental_start_dt AS CHAR) as rental_start_dt FROM bookshelf.books_info WHERE title LIKE '%"+sendkey+'%'"'"
        elif qerytype == ALL:
            sql = "SELECT id,area,title,rental_status,rental_user_name,CAST(rental_start_dt AS CHAR) as rental_start_dt FROM bookshelf.books_info WHERE del_flg = 0 ORDER BY update_dt DESC"
        elif qerytype == DEL:
            delid = data['delid']
            print(delid)    
            sql = "UPDATE books_info SET del_flg = 1 WHERE id = '"+delid+"'"


        #クエリ発行
        if qerytype == DEL:
            cur.execute(sql)
            conn.commit()
        elif qerytype == INS:
            print("クエリ発行")
            #cur.execute(sql, (area, title, author, publisher, url, create_dt, create_dt)) 
            cur.execute(sql)
            conn.commit()
        else:
            cur.execute(sql)
            cur.statement    
            book = cur.fetchall()

            if book is not None:
                return book
            else:
                return None
    except:
        print("DBエラーが発生しました")
        return None
    finally:
        cur.close()
        conn.close()


#if __name__ == "__main__":
#    run(host='localhost', port=8086, reloader=True, debug=True)