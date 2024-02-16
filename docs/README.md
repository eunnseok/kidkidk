# 프로젝트 키득😆

## 프로젝트 소개

아이들에게 경제 관념을 일깨워 줄 수 있도록 제작한 웹사이트

가상의 직업을 아이들에게 부여하고 부모님이 주는 업무를 수행하며 코인을 지급받습니다. 아이들은 지급 받은 코인을 이용하여 적금과 투자를 간접적으로 체험하면서 코인을 불려 나갈 수 있습니다. 코인은 웹사이트가 제공하는 환율에 따라 부모님의 용돈으로 환전이 가능합니다.
[영감을 받은 동영상](https://www.youtube.com/watch?v=w5V4x19248Y).

## 페르소나 분석

![김딸_페르소나](/etc/assets/김딸_페르소나.png){: width="50%"}

![김주부_페르소나](/etc/assets/김주부_페르소나.png){: width="50%"}


## 개발 환경 통일

#### **BackEnd**

<details>
<summary>Intellij 환경 통일</summary>

<!-- summary 아래 한칸 공백 두어야함 -->

## SSAFY-B305-coding-convention.xml

```
<code_scheme name="SSAFY-B305-coding-convention">
  <option name="CLASS_COUNT_TO_USE_IMPORT_ON_DEMAND" value="99" />
  <option name="NAMES_COUNT_TO_USE_IMPORT_ON_DEMAND" value="99" />
  <option name="IMPORT_LAYOUT_TABLE">
    <value>
      <emptyLine />
      <package name="" withSubpackages="true" static="true" />
      <emptyLine />
      <package name="java" withSubpackages="true" static="false" />
      <emptyLine />
      <package name="javax" withSubpackages="true" static="false" />
      <emptyLine />
      <package name="org" withSubpackages="true" static="false" />
      <emptyLine />
      <package name="net" withSubpackages="true" static="false" />
      <emptyLine />
      <package name="com" withSubpackages="true" static="false" />
      <emptyLine />
      <package name="" withSubpackages="true" static="false" />
      <emptyLine />
    </value>
  </option>
  <option name="RIGHT_MARGIN" value="120" />
  <option name="ENABLE_JAVADOC_FORMATTING" value="false" />
  <option name="JD_KEEP_EMPTY_LINES" value="false" />
  <option name="FORMATTER_TAGS_ENABLED" value="true" />
  <XML>
    <option name="XML_LEGACY_SETTINGS_IMPORTED" value="true" />
  </XML>
  <codeStyleSettings language="JAVA">
    <option name="LINE_COMMENT_AT_FIRST_COLUMN" value="false" />
    <option name="LINE_COMMENT_ADD_SPACE" value="true" />
    <option name="KEEP_FIRST_COLUMN_COMMENT" value="false" />
    <option name="KEEP_CONTROL_STATEMENT_IN_ONE_LINE" value="false" />
    <option name="KEEP_BLANK_LINES_IN_DECLARATIONS" value="1" />
    <option name="KEEP_BLANK_LINES_IN_CODE" value="1" />
    <option name="KEEP_BLANK_LINES_BEFORE_RBRACE" value="1" />
    <option name="ALIGN_MULTILINE_PARAMETERS" value="false" />
    <option name="SPACE_AFTER_TYPE_CAST" value="false" />
    <option name="SPACE_BEFORE_ARRAY_INITIALIZER_LBRACE" value="true" />
    <option name="CALL_PARAMETERS_WRAP" value="1" />
    <option name="METHOD_PARAMETERS_WRAP" value="1" />
    <option name="EXTENDS_LIST_WRAP" value="1" />
    <option name="METHOD_CALL_CHAIN_WRAP" value="5" />
    <option name="THROWS_LIST_WRAP" value="5" />
    <option name="EXTENDS_KEYWORD_WRAP" value="1" />
    <option name="BINARY_OPERATION_WRAP" value="1" />
    <option name="BINARY_OPERATION_SIGN_ON_NEXT_LINE" value="true" />
    <option name="TERNARY_OPERATION_WRAP" value="1" />
    <option name="ARRAY_INITIALIZER_WRAP" value="1" />
    <indentOptions>
      <option name="INDENT_SIZE" value="4" />
      <option name="CONTINUATION_INDENT_SIZE" value="4" />
      <option name="TAB_SIZE" value="4" />
    </indentOptions>
  </codeStyleSettings>
</code_scheme>
```

</details>

#### **FrontEnd**

<details>
<summary>VS Code 환경 통일</summary>

<!-- summary 아래 한칸 공백 두어야함 -->

## .prettierrc

```
{ // .prettierrc
  "printWidth": 120,
	"semi": true,
	"trailingComma": "es5",
	"arrowParens": "always",
	"tabWidth": 4,
	"useTabs": false,
	"singleQuote": true
}
```

</details>

## 컨벤션

### **BackEnd Convention**

-   패키지의 경우
    -   소문자 ASCII 문자로 작성하며 현재 com, edu, gov, mil, net, org와 같은 최상위 도메인 이름으로 작성

        (ie. com.sun.eng, com.apple.quicktime.v2, edu.cmu.cs.bovik.cheese)
-   클래스, 인터페이스 명의 경우

    -   PascalCase 사용
        ```jsx
        // 단어를 조합할 때 단어의 첫 글자를 대문자로 지정
        class Person
        ```
    -   명사 형태를 사용하기
        ```jsx
        // Bad
        class IncludedPerson
        class RunningPerson

        // Good
        class ImageSprite
        ```
    -   인터페이스를 구현한 클래스와의 관계가 1:1인 경우와 아닌 경우에서 네이밍

        -   1:1일때
            ```jsx
            // 인터페이스를 구현한 클래스와의 관계가 1:1인 경우 인터페이스명+Impl을 붙이기
            public interface MemberService	// 인터페이스
            public class MemberServiceImpl implements MemberService	// 구현체   
            ```
        -   그렇지 않을 경우

            ```jsx
            public interface MemberService	// 인터페이스

            public class AdminMemberService implements MemberService	// 관리자 동작 구현체
            public class CommonMemberService implements MemberService	// 일반회원 동작 구현체
            ```

-   변수 or 메소드 명의 경우
    -   camelCase 사용
        ```jsx
        // 첫 글자는 소문자, 나머지 단어의 첫 글자를 대문자로 지정
        String userContent

        public void setUserInfo(){}
        ```
    -   메소드의 경우 동사 형태를 사용하기
        ```jsx
        public void getBackground(){}
        ```
-   상수의 경우
    -   대문자에 단어의 사이에 언더바(\_)를 사용
    -   final int MAX_VALUE = 10000;

(세부사항 : [https://naver.github.io/hackday-conventions-java](https://naver.github.io/hackday-conventions-java))

### **Database Naming Convention**

1. NAMING CONVENTIONS

-   식별자 이름에 공백, 따옴표를 포함해서는 안 됩니다.
-   식별자는 완전히 소문자로 써야 합니다.
    ``` jsx
    // Bad
    "FirstName"
    First Name
    First_Name

    // Good
    first_name
    ```
-   여러 단어로 구성된 개체 이름은 밑줄로 구분해야 합니다.
    (ie. [snake_case](https://en.wikipedia.org/wiki/Snake_case))
    ``` jsx
    // Bad
    wordcount
    wordCount
    teamMemberId

    // Good
    word_count
    team_member_id
    ```
-   데이터 유형은 이름이 아닙니다.
    데이터베이스 개체 이름, 특히 열 이름은 필드 또는 개체를 설명하는 명사여야 합니다.
    ``` jsx
    // Bad
    String
    text
    timestamp

    // Good
    title
    content
    join_date
    ```
-   데이터를 저장하는 표, 뷰 및 기타 관계는 복수가 아니라 단일 이름을 가져야 합니다.
    ``` jsx
    // Bad
    Persons

    // Good
    Person
    ```
-   약어가 아니라 전체 단어입니다. 개체 이름은 전체 영어 단어여야 합니다.
    ``` jsx
    // Bad
    mid_nm

    // Good
    mid_name
    ```
-   예약된 단어는 피하세요. 
    사용 중인 데이터베이스에서 예약된 단어로 간주되는 단어는 사용하지 마세요.

    불필요한 편집기 구문강조도 방지할 수 있습니다. 
    (ie. [mariadb 예약어 목록](https://mariadb.com/kb/en/reserved-words))

2. KEY FIELDS

-   기본키 필드 이름은 id로 합니다.

    몇몇 가이드에선 데이블 이름을 기본키 필드 이름에 접두사로 사용하는데(Ex. person_id)
    , 이는 중복적이며 좋지 않은 생각입니다. 여러 테이블을 조인하는등 비단순 SQL문 쿼리 내에서 명시적(Ex. person.id)으로 처리해 사용하는것이 더 바람직합니다.
    ``` sql
    -- Bad
    CREATE TABLE person (
    person_id     bigint PRIMARY KEY,
    full_name     text NOT NULL,
    birth_date    date NOT NULL);

    -- Good
    CREATE TABLE person (
    id            bigint PRIMARY KEY,
    full_name     text NOT NULL,
    birth_date    date NOT NULL);
    ```
-   외래키 필드는 참조되는 테이블과 필드의 이름을 결합하여 명명해야 합니다.
    ``` sql
    -- 아래의 예시에선, team_member 테이블은 team과 person 테이블의 기본키를 참조한다.
    -- team_id, person_id(복합 기본키 명명 team_member_pkey)
    CREATE TABLE team_member (
    team_id       bigint NOT NULL REFERENCES team(id),
    person_id     bigint NOT NULL REFERENCES person(id),
    CONSTRAINT team_member_pkey PRIMARY KEY (team_id, person_id));
    ```
-   Etc...

    -   Prefixes and Suffixes
        -   테이블, 뷰 등의 접두사 사용 금지(TB_name, VW_name)
        -   앱 이름(프로젝트 이름) 접두사 사용 금지(키득_tablename)
        -   데이터 타입 접미사 사용 금지(name_text, name_string)
    -   Indexes
        -   명확한 인덱스 이름 사용(person_ix_first_name_last_name)
    -   Constraints
        -   명확한 제약 조건 이름 사용(team_member_team_id_fkey)

3. 엔진, 문자 집합, 정렬 순서 지정

-   ENGIN, DEFAULT CHARSET, COLLATE 설정
    ``` sql
    -- InnoDB, 4바이트 utf8 인코딩, 대소문자 구별하지 않는 정렬(다른 넓은 호환성을 가진 선택지: utf8mb4_unicode_ci, utf8mb4_general_ci)
    CREATE TABLE person (
    person_id     bigint PRIMARY KEY,
    full_name     text NOT NULL,
    birth_date    date NOT NULL
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0990_ai_ci;
    ```

(세부사항 : [https://launchbylunch.com/posts/2014/Feb/16/sql-naming-conventions](https://launchbylunch.com/posts/2014/Feb/16/sql-naming-conventions))


### **FrontEnd Convention**

#### **Coding Convention**

1. **들여쓰기**  
   space와 tab을 섞어서 사용하지 않는다.
2. **문장의 종료**  
   한 줄에 하나의 문장만 허용하며, 문장 종료 시에는 반드시 세미콜론(;)을 사용한다.
3. **명명 규칙**

   - 예약어를 사용하지 않는다.
     ```
     // Bad
     let class;
     let enum;
     let extends;
     let super;
     let const;
     let export;
     let import;
     ```
   - 상수는 영문 대문자 스네이크 표기법(Snake case)를 사용한다.
   - 생성자는 파스칼 케이스을 사용한다.
   - 변수, 함수에는 카멜 케이스을 사용한다.
   - (지역 변수 or private 변수)명은 '\_'로 시작한다.

     ```
     let _privateVariableName;
     let _privateFunctionName;

     // 객체일 경우
     const customObjectName = {};
     customObjectName.propertyName;
     customObjectName._privatePropertyName;
     _privateCustomObjectName;
     _privateCustomObjectName._privatePropertyName;
     ```

4. **선언과 할당**
   - 값이 변하지 않는 변수는 const를, 값이 변하는 변수는 let을 사용하여 선언한다. var는 사용하지 않도록 한다.
5. **배열과 객체**

   - 배열과 객체는 반드시 리터럴로 선언한다.
   - 배열 복사 시 순환문을 사용하지 않는다.

     ```
     const len = items.length;
     let i;

     // Bad
     for (i = 0; i < len; i++) {
         itemsCopy[i] = items[i];
     }

     // Good
     const itemsCopy = [...items];
     ```

   - 배열의 요소중 하나라도 줄 바꿈이 있다면 배열 안의 요소는 일관되게 모두 줄 바꿈을 해주어야 한다.
   - 객체의 프로퍼티가 1개인 경우에만 한 줄 정의를 허용하며, 2개 이상일 경우에는 개행을 강제한다.

     ```
     // Bad - 개행
     const obj = {foo: 'a', bar: 'b'}

     // Good
     const obj = {foo: 'a'};

     // Good
     const obj = {
         foo: 'a'
     };
     ```

   - 객체 리터럴 정의 시 콜론 앞은 공백을 허용하지 않으며 콜론 뒤는 항상 공백을 강제한다.

     ```
     // Bad
     var obj = {
         foo : 'a'
     }

     // Good
     var obj = {
         foo: 'a'
     }
     ```

   - 객체의 메서드 표현 시 축약 메소드 표기를 사용한다.

     ```
     // Bad
     const atom = {
         value: 1,

         addValue: function(value) {
             return atom.value + value;
         }
     };

     // Good
     const atom = {
         value: 1,

         addValue(value) {
             return atom.value + value;
         }
     };
     ```

6. **함수**

   - 함수는 사용 전에 선언해야 하며, 함수 선언문은 변수 선언문 다음에 오도록 한다.
   - 함수 표현식 대신 화살표 함수를 사용한다.

     ```
     // Bad
         [1, 2, 3].map(function (x) {
         const y = x + 1;
         return x * y;
     });

     // Good
         [1, 2, 3].map(x => {
         const y = x + 1;
         return x * y;
     });
     ```

   - 화살표 함수의 파라미터가 하나이면 괄호를 생략한다.
   - 암시적 반환을 최대한 활용한다. 함수의 본체가 하나의 표현식이면 중괄호를 생략하고 암시적 반환을 사용할 수 있다. 그 외에는 return문을 명시해야 한다.

7. **Destructuring**

   - 오브젝트의 프로퍼티에 접근할 때는 Destructuring을 이용한다.

     ```
     // Bad
     function getFullName(user) {
         const firstName = user.firstName;
         const lastName = user.lastName;

         return `${firstName} ${lastName}`;
     }

     // Bad
     const first = arr[0];
     const second = arr[1];

     // Good
     function getFullName(obj) {
         const {firstName, lastName} = obj;

         return `${firstName} ${lastName}`;
     }

     // Good
     const [first, second] = arr;

     // Good
     function getFullName({firstName, lastName}) {
         return `${firstName} ${lastName}`;
     }
     ```

8. **템플릿 문자열**
   - 변수 등을 조합해서 문자열을 생성하는 경우 템플릿 문자열을 이용한다.
     ```
     // Good
         function sayHi(name) {
         return `How are you, ${name}?`;
     }
     ```
9. **모듈**
   - 항상 일관된 import와 export를 이용한다.
     ```
     // Good
     import AirbnbStyleGuide from './AirbnbStyleGuide';
     export default AirbnbStyleGuide.es6;
     ```
10. **순회하기**

    - 반복문 사용은 일반화된 순회 메서드 사용을 권장한다.

      ```
      // Good
      var i, len
      for (i = 0, len = array.length; i < len; i += 1) ...

      // Good
      [1, 2, 3].forEach(array, function(value, index) {
          ...
      });
      ```

11. **주석**
    - 주석은 설명하려는 구문에 맞춰 들여쓰기 한다.
    - 문장 끝에 주석을 작성할 경우, 한 줄 주석을 사용하며 공백을 추가한다.
    - 여러 줄 주석을 작성할 때는 \*의 들여쓰기를 맞춘다. 주석의 첫 줄과 마지막 줄은 비워둔다.
    - 코드 블럭 주석 처리를 위해서는 한 줄 주석을 사용한다.
12. **공백**
    - 키워드, 연산자와 다른 코드 사이에 공백이 있어야 한다.
    - 시작 괄호 바로 다음과 끝 괄호 바로 이전에 공백이 있으면 안 된다.
    - 콤마 다음에 값이 올 경우 공백이 있어야 한다.

#### **CSS Convention**

1. CSS 모든 속성은 영문 소문자를 사용한다.
2. CSS 속성 선언 순서는 다음과 같다.  
   | 순서 | 속성 | 의미 |
   | ---------------- | ---------------- | ---------------- |
   | 1 | display | 표시 |
   | 2 | overflow | 넘침 |
   | 3 | float | 흐름 |
   | 4 | position | 위치 |
   | 5 | z-index | 정렬 |
   | 6 | width & height | 크기 |
   | 7 | margin & padding(그룹) | 간격 |
   | 8 | border(그룹) | 보더 |
   | 9 | background(그룹) | 배경 |
   | 10 | font(그룹) | 폰트 |
   | 11 | 기타 | 기타 속성은 순서 무관 |
   | | | |
3. CSS classNameing Convention은 BEM을 사용한다.
   - BEM은 Block, Element, Modifier를 의미하며 각각 \_\_와 --로 구분
     ```
     .header__navigation--navi-text {
         color: red;
     }
     ```
   - Block : 재사용 가능한 기능적으로 독립적인 페이지 컴포넌트
   - Element : 엘리먼트는 블럭을 구성하는 단위, 자신이 속한 블럭 내에서만 의미를 가짐
   - Modifier : 블럭이나 엘리먼트의 속성을 담당, 생긴 게 조금 다르거나, 다르게 동작하는 블럭이나 엘리먼트를 만들 때 사용
4. 선택자 작성 규칙
   - 선택자는 상위 선택자를 포함하여 3개 이상 작성되지 않게 합니다.
   - 전체 선택자를 사용하지 않습니다.
   - 정규 표현식과 유사한 애트리뷰트 선택자 사용을 지양하며, 부적합한 애트리뷰트 선택자 사용을 지양합니다.
   - 아이디 선택자를 사용하지 않습니다.
   - 클래스 규칙에 불필요한 태그를 조합하여 사용하지 않습니다.
   - 태그 선택자 규칙에 상위 선택자로 태그를 포함하지 않습니다.

### Commit Convention

#### 1. Commit Message 구조
> 기본적으로 Commit Message는 제목/본문/꼬리말로 구성합니다.

각 파트는 아래와 같은 형태로 빈 줄 하나를 두고 구분을 시켜주면 됩니다.

```
[:gitmoji:]type(옵션): [#issueNumber-]Subject  // 제목

body(옵션)                                     // 본문

footer(옵션)                                   // 꼬리말
```

*   type: 어떤 의도로 commit했는지를 type에 명시 (ex. Feat, Fix, Docs)
*   Subject: **제목**, 코드 변경사항에 대한 짧은 요약을 나타냅니다.
*   body: 긴 설명이 필요한 경우에만 본문 내용으로써 작성해주면 됩니다. 어떻게 작성했는지가 아닌, **무엇을 왜 했는지**를 작성해주면 됩니다.
    * 즉, 부연설명이 필요하거나 커밋의 이유를 설명할 경우 작성해줍니다.
*   footer: issue tracker ID를 명시하고 싶은 경우에 작성  

<br>

#### 2. 타입(Commit Type)
Commit Message의 타입(type)은 아래와 같은 규약을 지키면서 작성하면 됩니다.
>1.타입은 **" 태그(tag) + 제목(subject) "** 으로 구성되며, 태그는 영어로 쓰되, 첫 문자는 대문자 로 합니다.  
2."태그: 제목" 의 형태이며, ":" 뒤에 space 가 있음에 유의합니다.  
ex) Feat: add new api (Feat가 태그, add new api가 제목)

##### 자주 사용하는 태그 종류

| 태그 | 의미 |
| ---------------- | --------------------------------------------------------------------------- |
| Feat | 새로운 기능 추가 |
| Fix | 버그 수정 |
| Add | Feat 이외의 부수적인 코드 추가/라이브러리 추가/ 새로운 View나 Activity 생성 |
| Docs | 문서 수정 |
| Style | 코드 formatting, 세미콜론 누락, 코드 자체의 변경이 없는 경우 |
| Refactor | 코드 리팩토링 |
| Test | 테스트 코드, 리팩토링 테스트 코드 추가 |
| Chore | 패키지 매니저 수정, 그 외 기타 수정 ex) .gitignore |
| Design | CSS 등 사용자 UI 디자인 변경 |
| Comment | 필요한 주석 추가 및 변경 |
| Rename | 파일 또는 폴더 명을 수정하거나 옮기는 작업만인 경우 |
| Remove | 파일을 삭제하는 작업만 수행한 경우 |
| !BREAKING CHANGE | 커다란 API 변경의 경우 |
| !HOTFIX | 급하게 치명적인 버그를 고쳐야 하는 경우 |
| | |

<br>

#### 3. 제목

제목은 코드의 변경 사항에 대해 짧은 요약을 나타냅니다.  
아래와 같은 규칙을 지켜주도록 합시다.

**영어로 제목을 작성하는 경우**
>1.제목은 50자를 넘기지 않고, 첫 글자를 대문자로 작성하며 마침표를 붙이지 않는다.  
>2.제목은 **과거형을 사용하지 않고, 명령조로 시작**한다.  
>ex) 제목을 Fixed가 아닌, Fix로 작성 -> Fix: Modify bank api

**한글로 제목을 작성하는 경우**
> 추가, 변경 등의 **명령조**로 시작합니다.  
>ex) Feat: 추가 bank api

<br>

#### 4. 본문 (Body)
본문은 아래와 같은 규칙에 따라 작성합니다.
>1.본문은 선택사항입니다.  
>2.부연설명이 필요하거나 커밋의 이유를 설명할 경우 작성해주면 됩니다.  
>3.본문 내용은 어떻게 변경했는지 보다, **무엇을 변경했는지** 또는 **왜 변경했는지**를 설명하도록 합시다.  
>4.제목과 구분되기 위해 공백 한 줄을 띄워서 작성합니다.

<br>

#### 5. 꼬리말 (footer)
꼬리말도 마찬가지로 아래 규칙에 따라 작성합니다.
>1.선택사항 (필수x)  
>2.issue tracker id를 작성할 때 사용합니다.  
>3.형식: 꼬리말은 **"유형: #이슈 번호"** 형식으로 사용합니다.

issue tracker 유형은 다음 중 하나를 사용합니다.
*   Fixed: 이슈 수정 중 (아직 해결되지 않은 경우)
*   Resolves: 이슈를 해결했을 때
*   Ref: 참고할 이슈가 있을 때
*   Related to: 해당 커밋에 관련된 이슈번호(아직 해결되지 않은 경우)

<br>

#### 6. Gitmoji
| 아이콘 | 코드 | 설명 | 원문 |
|-------|----------|----------|-----------------------------|
| :art: | `:art:` | 코드의 구조/형태 개선 | Improve structure/format of the code. |
| :zap: | `:zap:` | 성능 개선 | Improve performance. |
| :fire: | `:fire:` | 코드/파일 삭제 | Remove code or files. |
| :bug: | `:bug:` | **버그 수정** | Fix a bug. |
| :ambulance: | `:ambulance:` | 긴급 수정 | Critical hotfix. |
| :sparkles: | `:sparkles:` | **새 기능** | Introduce new features. |
| :memo: | `:memo:` | 문서 추가/수정 | Add or update documentation. |
| :lipstick: | `:lipstick:` | UI/스타일 파일 추가/수정 | Add or update the UI and style files. |
| :tada: | `:tada:` | 프로젝트 시작 | Begin a project. |
| :white_check_mark: | `:white_check_mark:` | **테스트 추가/수정** | Add or update tests. |
| :lock: | `:lock:` | 보안 이슈 수정 | Fix security issues. |
| :bookmark: | `:bookmark:` | **릴리즈/버전 태그** | Release / Version tags. |
| :green_heart: | `:green_heart:` | CI 빌드 수정 | Fix CI Build. |
| :pushpin: | `:pushpin:` | 특정 버전 의존성 고정 | Pin dependencies to specific versions. |
| :construction_worker: | `:construction_worker:` | CI 빌드 시스템 추가/수정 | Add or update CI build system. |
| :chart_with_upwards_trend: | `:chart_with_upwards_trend:` | 분석, 추적 코드 추가/수정 | Add or update analytics or track code. |
| :recycle: | `:recycle:` | 코드 리팩토링 | Refactor code. |
| :heavy_plus_sign: | `:heavy_plus_sign:` | 의존성 추가 | Add a dependency. |
| :heavy_minus_sign: | `:heavy_minus_sign:` | 의존성 제거 | Remove a dependency. |
| :wrench: | `:wrench:` | 구성 파일 추가/삭제 | IAdd or update configuration files. |
| :hammer: | `:hammer:` | 개발 스크립트 추가/수정 | Add or update development scripts. |
| :globe_with_meridians: | `:globe_with_meridians:` | 국제화/현지화 | Internationalization and localization. |
| :poop: | `:poop:` | **똥싼 코드** | Write bad code that needs to be improved. |
| :rewind: | `:rewind:` | 변경 내용 되돌리기 | Revert changes. |
| :twisted_rightwards_arrows: | `:twisted_rightwards_arrows:` | 브랜치 합병	 | Merge branches. |
| :package: | `:package:` | 컴파일된 파일 추가/수정 | Add or update compiled files or packages. |
| :alien: | `:alien:` | 외부 API 변화로 인한 수정 | Update code due to external API changes. |
| :truck: | `:truck:` | 리소스 이동, 이름 변경 | Move or rename resources (e.g.: files paths routes). |
| :page_facing_up: | `:page_facing_up:` | 라이센스 추가/수정 | Add or update license. |
| :bulb: | `:bulb:` | 주석 추가/수정 | Add or update comments in source code. |
| :card_file_box: | `:card_file_box:` | 데이버베이스 관련 수정 | Perform database related changes. |
| :loud_sound: | `:loud_sound:` | 로그 추가/수정 | Add or update logs. |
| :see_no_evil: | `:see_no_evil:` | gitignore 추가/수정 | Add or update a .gitignore file. |


<br>

#### 7. Commit Message 예시
Login API를 개발한 내용을 커밋할 때의 예시는 아래와 같습니다.

```
[:gitmoji:]Feat: Add login API      // 타입 : 제목

로그인 API 개발                      // 본문

Resolves: #123                      // 꼬리말 => 이슈 123을 해결, 
Ref: #456                           이슈 456을 참고, 현재 커밋에서
Related to: #11, #12                아직 이슈11, 12가 해결되지 않음
```

### PR 컨벤션

-   제목은 영어로 작성한다.
-   [영어 대문자] #이슈번호 - 해당 이슈 내용 (꼭 이슈랑 동일하지는 않아도 된다. 이슈 번호만 신경써서 적기)
-   개요,작업사항,변경로직,변경전,변경후,사용방법,기타를 작성한다.
-   PR템플릿을 사용한다.
-   PR은 최대한 작은 단위로 쪼갠다.(1개의 PR에는 1개의 작업)
-   라벨을 설정한다.
-   코드 리뷰를 받는다.
-   변경 request 단 경우 확인 후 resolve를 한다.

### Issue 컨벤션 
- Template name : 키득키득 이슈 템플릿
- About : 해당 템플릿을 사용하여 이슈를 작성해주세요.
- Template content
    
    ```html
    ## 목적
    > 목적에 맞는 기능을 구현한다. 
    ## 작업 상세 내용 
    - [ ] 구현내용1
    - [ ] 구현내용2
    ## 참고 사항
    [작업에 필요한 참고 내용](https://www.google.co.kr/?hl=ko)
    ```
